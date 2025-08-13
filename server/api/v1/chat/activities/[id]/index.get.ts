import { z } from 'zod'

const paramsSchema = z.object({
  id: z.string().uuid('Invalid activity ID format')
})

export default defineEventHandler(async (event) => {
  try {
    // Validate route parameters
    const params = getRouterParams(event)
    const { id } = paramsSchema.parse(params)

    // Mock data - replace with actual database query
    const currentUserId = 'current-user-id' // Should come from auth context
    
    const activities = {
      '550e8400-e29b-41d4-a716-446655440001': {
        id,
        title: 'Morning Commute Group',
        type: 'Cycling',
        date: 'Today, 7:30 AM',
        participants: 8,
        distance: '15.2 km',
        duration: '45 min',
        pace: '3:02/km',
        lastMessage: 'See you all at the usual spot!',
        lastMessageTime: '5m ago',
        unreadCount: 3,
        description: 'Daily morning commute group for downtown cyclists',
        route: {
          start: 'Central Park',
          end: 'Downtown Office',
          waypoints: ['Subway Station', 'Coffee Shop']
        },
        creatorId: 'current-user-id',
        creatorName: 'You',
        isOwner: true,
        role: 'owner',
        permissions: ['invite_members', 'remove_members', 'edit_activity', 'delete_activity', 'manage_settings']
      },
      '550e8400-e29b-41d4-a716-446655440002': {
        id,
        title: 'Weekend Adventure Riders',
        type: 'Motorbike',
        date: 'Yesterday',
        participants: 12,
        distance: '85.7 km',
        duration: '2h 15m',
        pace: '1:35/km',
        lastMessage: 'Great ride yesterday!',
        lastMessageTime: '2h ago',
        unreadCount: 0,
        description: 'Weekend motorbike adventures and scenic routes',
        route: {
          start: 'City Center',
          end: 'Mountain Peak',
          waypoints: ['Highway Stop', 'Scenic Overlook']
        },
        creatorId: 'other-user-id',
        creatorName: 'Alex Chen',
        isOwner: false,
        role: 'member',
        permissions: ['send_messages', 'view_participants']
      },
      '550e8400-e29b-41d4-a716-446655440003': {
        id,
        title: 'City Exploration Club',
        type: 'Cycling',
        date: '2 days ago',
        participants: 6,
        distance: '22.4 km',
        duration: '1h 10m',
        pace: '3:08/km',
        lastMessage: 'Anyone up for tomorrow?',
        lastMessageTime: '1d ago',
        unreadCount: 1,
        description: 'Urban cycling and city exploration group',
        route: {
          start: 'Main Square',
          end: 'Riverside Park',
          waypoints: ['Historic District', 'Food Market']
        },
        creatorId: 'other-user-id-2',
        creatorName: 'Sarah Johnson',
        isOwner: false,
        role: 'member',
        permissions: ['send_messages', 'view_participants']
      },
      '550e8400-e29b-41d4-a716-446655440004': {
        id,
        title: 'Mountain Trail Seekers',
        type: 'Cycling',
        date: '3 days ago',
        participants: 5,
        distance: '32.1 km',
        duration: '2h 30m',
        pace: '4:40/km',
        lastMessage: 'Trail conditions are good this week',
        lastMessageTime: '2d ago',
        unreadCount: 0,
        description: 'Mountain biking and trail exploration enthusiasts',
        route: {
          start: 'Trail Head',
          end: 'Mountain Summit',
          waypoints: ['Waterfall', 'Rest Stop']
        },
        creatorId: 'current-user-id',
        creatorName: 'You',
        isOwner: true,
        role: 'owner',
        permissions: ['invite_members', 'remove_members', 'edit_activity', 'delete_activity', 'manage_settings']
      }
    }

    const activity = activities[id]
    
    if (!activity) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Activity not found'
      })
    }

    return activity

  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid activity ID',
        data: error.errors
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch activity details'
    })
  }
})