import { z } from 'zod'

const paramsSchema = z.object({
  id: z.string().uuid('Invalid activity ID format')
})

const querySchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(50),
  before: z.string().optional(),
  after: z.string().optional()
})

export default defineEventHandler(async (event) => {
  try {
    // Validate route parameters
    const params = getRouterParams(event)
    const { id: activityId } = paramsSchema.parse(params)
    
    // Validate query parameters
    const query = getQuery(event)
    const { limit, before, after } = querySchema.parse(query)

    // Mock messages - replace with actual database query
    const mockMessages: ChatMessage[] = [
      {
        id: '1',
        activityId: activityId,
        userId: 'user-1',
        userName: 'Alex Chen',
        content: 'Hey everyone! Ready for the morning ride?',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        isCurrentUser: false
      },
      {
        id: '2',
        activityId: activityId,
        userId: 'user-2',
        userName: 'Sarah Johnson',
        content: 'Absolutely! Weather looks perfect today',
        timestamp: new Date(Date.now() - 3300000).toISOString(),
        isCurrentUser: false
      },
      {
        id: '3',
        activityId: activityId,
        userId: 'user-3',
        userName: 'Mike Rodriguez',
        content: 'I\'ll be there in 10 minutes. Running a bit late',
        timestamp: new Date(Date.now() - 3000000).toISOString(),
        isCurrentUser: false
      },
      {
        id: '4',
        activityId: activityId,
        userId: 'current-user',
        userName: 'You',
        content: 'No worries! We\'ll wait at the usual meeting spot',
        timestamp: new Date(Date.now() - 2700000).toISOString(),
        isCurrentUser: true
      },
      {
        id: '5',
        activityId: activityId,
        userId: 'user-4',
        userName: 'Emma Wilson',
        content: 'Great ride yesterday! Same route today?',
        timestamp: new Date(Date.now() - 2400000).toISOString(),
        isCurrentUser: false
      },
      {
        id: '6',
        activityId: activityId,
        userId: 'current-user',
        userName: 'You',
        content: 'Let\'s try the scenic route through the park today',
        timestamp: new Date(Date.now() - 2100000).toISOString(),
        isCurrentUser: true
      },
      {
        id: '7',
        activityId: activityId,
        userId: 'user-1',
        userName: 'Alex Chen',
        content: 'Sounds perfect! See you all there',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        isCurrentUser: false
      },
      {
        id: '8',
        activityId: activityId,
        userId: 'user-2',
        userName: 'Sarah Johnson',
        content: 'See you soon! 🚴‍♂️',
        timestamp: new Date(Date.now() - 1500000).toISOString(),
        isCurrentUser: false
      }
    ]

    // Filter messages based on before/after parameters if provided
    let filteredMessages = mockMessages
    
    if (before) {
      const beforeDate = new Date(before)
      filteredMessages = filteredMessages.filter(msg => 
        new Date(msg.timestamp) < beforeDate
      )
    }
    
    if (after) {
      const afterDate = new Date(after)
      filteredMessages = filteredMessages.filter(msg => 
        new Date(msg.timestamp) > afterDate
      )
    }

    // Sort by timestamp (oldest first)
    filteredMessages.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    )

    // Apply pagination
    const paginatedMessages = filteredMessages.slice(-limit)

    return {
      messages: paginatedMessages,
      hasMore: filteredMessages.length > limit,
      total: filteredMessages.length
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid parameters',
        data: error.errors
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch messages'
    })
  }
})