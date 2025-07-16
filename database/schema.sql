-- Rider Tracker App Database Schema
-- Run this script in your Supabase SQL editor to set up the database

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  preferred_vehicle VARCHAR(20) CHECK (preferred_vehicle IN ('bicycle', 'motorbike')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create rides table
CREATE TABLE rides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  vehicle_type VARCHAR(20) NOT NULL CHECK (vehicle_type IN ('bicycle', 'motorbike')),
  status VARCHAR(20) NOT NULL CHECK (status IN ('recording', 'paused', 'completed', 'cancelled')),
  start_location JSONB NOT NULL,
  end_location JSONB,
  duration INTEGER, -- in milliseconds
  distance NUMERIC, -- in meters
  route_points JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  finished_at TIMESTAMP WITH TIME ZONE
);

-- Create route_points table
CREATE TABLE route_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id UUID NOT NULL REFERENCES rides(id) ON DELETE CASCADE,
  lat NUMERIC NOT NULL,
  lng NUMERIC NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  speed NUMERIC,
  altitude NUMERIC
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_rides_user_id ON rides(user_id);
CREATE INDEX idx_rides_created_at ON rides(created_at DESC);
CREATE INDEX idx_rides_status ON rides(status);
CREATE INDEX idx_route_points_ride_id ON route_points(ride_id);
CREATE INDEX idx_route_points_timestamp ON route_points(timestamp);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_points ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Rides policies
CREATE POLICY "Users can view own rides" ON rides
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own rides" ON rides
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own rides" ON rides
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own rides" ON rides
  FOR DELETE USING (auth.uid() = user_id);

-- Route points policies
CREATE POLICY "Users can view own route points" ON route_points
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM rides 
      WHERE rides.id = route_points.ride_id 
      AND rides.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create route points for own rides" ON route_points
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM rides 
      WHERE rides.id = route_points.ride_id 
      AND rides.user_id = auth.uid()
    )
  );

-- Functions for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update profiles updated_at
CREATE OR REPLACE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Sample data (optional - remove for production)
-- INSERT INTO profiles (user_id, display_name, preferred_vehicle)
-- VALUES (
--   gen_random_uuid(),
--   'Demo User',
--   'bicycle'
-- );

-- Grant permissions for authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant permissions for anon users (limited)
GRANT USAGE ON SCHEMA public TO anon;

-- Comments for documentation
COMMENT ON TABLE profiles IS 'User profiles with preferences and settings';
COMMENT ON TABLE rides IS 'Ride records with tracking data and metadata';
COMMENT ON TABLE route_points IS 'Individual GPS points recorded during rides';

COMMENT ON COLUMN profiles.user_id IS 'References auth.users.id';
COMMENT ON COLUMN profiles.preferred_vehicle IS 'User preferred vehicle type';
COMMENT ON COLUMN rides.start_location IS 'Starting location coordinates and address';
COMMENT ON COLUMN rides.end_location IS 'Ending location coordinates and address';
COMMENT ON COLUMN rides.duration IS 'Total ride duration in milliseconds';
COMMENT ON COLUMN rides.distance IS 'Total distance traveled in meters';
COMMENT ON COLUMN rides.route_points IS 'Cached route points for quick access';
COMMENT ON COLUMN route_points.lat IS 'Latitude coordinate';
COMMENT ON COLUMN route_points.lng IS 'Longitude coordinate';
COMMENT ON COLUMN route_points.speed IS 'Speed at this point in km/h';
COMMENT ON COLUMN route_points.altitude IS 'Altitude at this point in meters'; 