import { z } from 'zod'

const querySchema = z.object({
  search: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0)
})

export default defineEventHandler(async (event) => {
  try {
    // Parse and validate query parameters
    const query = getQuery(event)
    const { search, limit, offset } = querySchema.parse(query)

    // Mock data for demonstration - replace with actual database query
    // Get current user ID from auth context
    const currentUserId = 'current-user-id' // This should come from auth context
    
    const mockActivities = [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
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
        creatorId: 'current-user-id',
        creatorName: 'You',
        isOwner: true,
        role: 'owner'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
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
        creatorId: 'other-user-id',
        creatorName: 'Alex Chen',
        isOwner: false,
        role: 'member'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
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
        creatorId: 'other-user-id-2',
        creatorName: 'Sarah Johnson',
        isOwner: false,
        role: 'member'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440004',
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
        creatorId: 'current-user-id',
        creatorName: 'You',
        isOwner: true,
        role: 'owner',
        permissions: ['invite_members', 'remove_members', 'edit_activity', 'delete_activity', 'manage_settings']
      }
    ]

    // Filter by search if provided
    let filteredActivities = mockActivities
    if (search) {
      const searchLower = search.toLowerCase()
      filteredActivities = mockActivities.filter(activity => 
        activity.title.toLowerCase().includes(searchLower) ||
        activity.type.toLowerCase().includes(searchLower)
      )
    }

    // Apply pagination
    const paginatedActivities = filteredActivities.slice(offset, offset + limit)

    return {
      activities: paginatedActivities,
      total: filteredActivities.length,
      hasMore: offset + limit < filteredActivities.length
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid query parameters',
        data: error.errors
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch activities'
    })
  }
})