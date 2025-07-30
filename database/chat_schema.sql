-- Chat System Database Schema for Rider Tracker App
-- Run this script in your MemFire Cloud SQL editor after the main schema

-- Chat rooms with support for different types
CREATE TABLE public.chat_rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100),
  description TEXT,
  room_type VARCHAR(20) NOT NULL DEFAULT 'group' CHECK (room_type IN ('group', 'direct', 'activity')),
  related_id UUID, -- ride_id for activity rooms, null for others
  avatar_url TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  last_message_content TEXT,
  last_message_user_id UUID REFERENCES auth.users(id)
);

-- Chat messages with support for different types and replies
CREATE TABLE public.chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT,
  message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'location', 'system', 'file')),
  attachments JSONB, -- file URLs, image URLs, location data, etc.
  reply_to UUID REFERENCES public.chat_messages(id),
  edited_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Room participants with roles and read status
CREATE TABLE public.room_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  last_read_at TIMESTAMPTZ DEFAULT NOW(),
  unread_count INTEGER DEFAULT 0,
  is_muted BOOLEAN DEFAULT false,
  UNIQUE(room_id, user_id)
);

-- User chat profiles (extends existing user data for chat features)
CREATE TABLE public.user_chat_profiles (
  user_id UUID REFERENCES auth.users(id) PRIMARY KEY,
  display_name VARCHAR(50),
  avatar_url TEXT,
  status VARCHAR(20) DEFAULT 'online' CHECK (status IN ('online', 'away', 'busy', 'offline')),
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Message reactions
CREATE TABLE public.message_reactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID REFERENCES public.chat_messages(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  emoji VARCHAR(10) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(message_id, user_id, emoji)
);

-- Create indexes for better performance
CREATE INDEX idx_chat_rooms_type ON public.chat_rooms(room_type);
CREATE INDEX idx_chat_rooms_created_by ON public.chat_rooms(created_by);
CREATE INDEX idx_chat_rooms_last_message ON public.chat_rooms(last_message_at DESC);
CREATE INDEX idx_chat_messages_room_id ON public.chat_messages(room_id);
CREATE INDEX idx_chat_messages_user_id ON public.chat_messages(user_id);
CREATE INDEX idx_chat_messages_created_at ON public.chat_messages(created_at DESC);
CREATE INDEX idx_room_participants_user_id ON public.room_participants(user_id);
CREATE INDEX idx_room_participants_room_id ON public.room_participants(room_id);
CREATE INDEX idx_message_reactions_message_id ON public.message_reactions(message_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_chat_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;

-- Chat rooms policies
CREATE POLICY "Users can view rooms they participate in" ON public.chat_rooms
FOR SELECT USING (
  id IN (SELECT room_id FROM public.room_participants WHERE user_id = auth.uid())
  OR created_by = auth.uid()
  OR is_public = true
);

CREATE POLICY "Users can create rooms" ON public.chat_rooms
FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Room creators and admins can update rooms" ON public.chat_rooms
FOR UPDATE USING (
  created_by = auth.uid() 
  OR id IN (
    SELECT room_id FROM public.room_participants 
    WHERE user_id = auth.uid() AND role IN ('admin', 'moderator')
  )
);

-- Chat messages policies
CREATE POLICY "Users can view messages in their rooms" ON public.chat_messages
FOR SELECT USING (
  room_id IN (SELECT room_id FROM public.room_participants WHERE user_id = auth.uid())
);

CREATE POLICY "Users can send messages to their rooms" ON public.chat_messages
FOR INSERT WITH CHECK (
  auth.uid() = user_id 
  AND room_id IN (SELECT room_id FROM public.room_participants WHERE user_id = auth.uid())
);

CREATE POLICY "Users can update own messages" ON public.chat_messages
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own messages" ON public.chat_messages
FOR DELETE USING (auth.uid() = user_id);

-- Room participants policies
CREATE POLICY "Users can view participants in their rooms" ON public.room_participants
FOR SELECT USING (
  room_id IN (SELECT room_id FROM public.room_participants WHERE user_id = auth.uid())
);

CREATE POLICY "Users can manage their own participation" ON public.room_participants
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Room admins can manage participants" ON public.room_participants
FOR ALL USING (
  room_id IN (
    SELECT room_id FROM public.room_participants 
    WHERE user_id = auth.uid() AND role IN ('admin', 'moderator')
  )
);

-- User chat profiles policies
CREATE POLICY "Users can view all chat profiles" ON public.user_chat_profiles
FOR SELECT USING (true);

CREATE POLICY "Users can manage own chat profile" ON public.user_chat_profiles
FOR ALL USING (auth.uid() = user_id);

-- Message reactions policies
CREATE POLICY "Users can view reactions in their rooms" ON public.message_reactions
FOR SELECT USING (
  message_id IN (
    SELECT id FROM public.chat_messages 
    WHERE room_id IN (SELECT room_id FROM public.room_participants WHERE user_id = auth.uid())
  )
);

CREATE POLICY "Users can manage own reactions" ON public.message_reactions
FOR ALL USING (auth.uid() = user_id);

-- Functions for chat functionality

-- Function to update room's last message info
CREATE OR REPLACE FUNCTION public.update_room_last_message()
RETURNS trigger AS $$
BEGIN
  UPDATE public.chat_rooms 
  SET 
    last_message_at = NEW.created_at,
    last_message_content = NEW.content,
    last_message_user_id = NEW.user_id
  WHERE id = NEW.room_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update room last message
CREATE OR REPLACE TRIGGER on_message_inserted
  AFTER INSERT ON public.chat_messages
  FOR EACH ROW EXECUTE FUNCTION public.update_room_last_message();

-- Function to increment unread count for room participants
CREATE OR REPLACE FUNCTION public.increment_unread_count()
RETURNS trigger AS $$
BEGIN
  UPDATE public.room_participants 
  SET unread_count = unread_count + 1
  WHERE room_id = NEW.room_id AND user_id != NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to increment unread count
CREATE OR REPLACE TRIGGER on_message_increment_unread
  AFTER INSERT ON public.chat_messages
  FOR EACH ROW EXECUTE FUNCTION public.increment_unread_count();

-- Function to create user chat profile automatically
CREATE OR REPLACE FUNCTION public.handle_new_user_chat_profile()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_chat_profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.email, 'User'))
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create chat profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created_chat_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_chat_profile();

-- Function to update updated_at timestamp for chat profiles
CREATE OR REPLACE FUNCTION public.update_chat_profile_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update chat profiles updated_at
CREATE OR REPLACE TRIGGER update_user_chat_profiles_updated_at
  BEFORE UPDATE ON public.user_chat_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_chat_profile_updated_at();

-- Enable realtime for chat tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.room_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.message_reactions;

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Comments for documentation
COMMENT ON TABLE public.chat_rooms IS 'Chat rooms supporting group chats, direct messages, and activity-based chats';
COMMENT ON TABLE public.chat_messages IS 'Individual chat messages with support for different types and replies';
COMMENT ON TABLE public.room_participants IS 'Users participating in chat rooms with roles and read status';
COMMENT ON TABLE public.user_chat_profiles IS 'Extended user profiles for chat features';
COMMENT ON TABLE public.message_reactions IS 'Emoji reactions to messages';

COMMENT ON COLUMN public.chat_rooms.room_type IS 'Type of room: group, direct, or activity';
COMMENT ON COLUMN public.chat_rooms.related_id IS 'Related entity ID (e.g., ride_id for activity rooms)';
COMMENT ON COLUMN public.chat_messages.message_type IS 'Type of message: text, image, location, system, file';
COMMENT ON COLUMN public.chat_messages.attachments IS 'JSON data for file URLs, location coordinates, etc.';
COMMENT ON COLUMN public.room_participants.unread_count IS 'Number of unread messages for this user in this room';