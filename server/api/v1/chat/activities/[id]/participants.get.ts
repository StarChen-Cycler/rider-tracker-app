import { z } from 'zod'

const paramsSchema = z.object({
  id: z.string().uuid('Invalid activity ID format')
})

export default defineEventHandler(async (event) => {
  try {
    // Validate route parameters
    const params = getRouterParams(event)
    const { id } = paramsSchema.parse(params)

    // TODO: Replace with actual database query
    // Get current user from auth context
    const currentUserId = 'current-user-id' // Should come from auth context
    
    // Mock participants data
    const participants = [
      {
        userId: 'current-user-id',
        userName: 'You',
        avatar: null,
        isOnline: true,
        lastSeen: null,
        role: 'owner',
        joinedAt: '2024-01-15T10:00:00Z'
      },
      {
        userId: 'user-alex-chen',
        userName: 'Alex Chen',
        avatar: null,
        isOnline: true,
        lastSeen: null,
        role: 'admin',
        joinedAt: '2024-01-15T10:30:00Z'
      },
      {
        userId: 'user-sarah-johnson',
        userName: 'Sarah Johnson',
        avatar: null,
        isOnline: false,
        lastSeen: '2024-01-15T15:20:00Z',
        role: 'member',
        joinedAt: '2024-01-16T09:15:00Z'
      },
      {
        userId: 'user-mike-wilson',
        userName: 'Mike Wilson',
        avatar: null,
        isOnline: true,
        lastSeen: null,
        role: 'member',
        joinedAt: '2024-01-16T14:45:00Z'
      },
      {
        userId: 'user-emma-davis',
        userName: 'Emma Davis',
        avatar: null,
        isOnline: false,
        lastSeen: '2024-01-15T18:30:00Z',
        role: 'member',
        joinedAt: '2024-01-17T11:00:00Z'
      }
    ]

    return {
      activityId: id,
      participants,
      totalCount: participants.length
    }

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
      statusMessage: 'Failed to fetch participants'
    })
  }
})