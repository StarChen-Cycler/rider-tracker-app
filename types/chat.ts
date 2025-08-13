export interface ChatActivity {
  id: string
  title: string
  type: 'Cycling' | 'Motorbike' | 'Running' | 'Walking'
  date: string
  participants: number
  distance: string
  duration: string
  pace: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  description?: string
  route?: {
    start: string
    end: string
    waypoints?: string[]
  }
  creatorId: string
  creatorName: string
  isOwner: boolean
  role: 'owner' | 'admin' | 'member'
  permissions: string[]
}

export interface ChatMessage {
  id: string
  activityId: string
  userId: string
  userName: string
  avatar?: string
  content: string
  timestamp: string
  isCurrentUser: boolean
}

export interface ChatRoom {
  id: string
  activityId: string
  title: string
  participants: ChatParticipant[]
  lastMessage?: ChatMessage
  unreadCount: number
  isActive: boolean
}

export interface ChatParticipant {
  userId: string
  userName: string
  avatar?: string
  isOnline: boolean
  lastSeen?: string
  role: 'owner' | 'admin' | 'member'
  joinedAt: string
  status: 'active' | 'pending' | 'invited'
}

export interface ActivityParticipantsResponse {
  activityId: string
  participants: ChatParticipant[]
  totalCount: number
  canInvite: boolean
  canRemove: boolean
}