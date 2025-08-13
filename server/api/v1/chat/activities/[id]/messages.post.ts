import { z } from 'zod'

const paramsSchema = z.object({
  id: z.string().uuid('Invalid activity ID format')
})

const bodySchema = z.object({
  content: z.string().min(1).max(1000, 'Message too long'),
  replyTo: z.string().uuid().optional()
})

export default defineEventHandler(async (event) => {
  try {
    // Validate route parameters
    const params = getRouterParams(event)
    const { id: activityId } = paramsSchema.parse(params)

    // Validate request body
    const body = await readBody(event)
    const { content, replyTo } = bodySchema.parse(body)

    // Get user from auth (mock for now)
    const userId = 'current-user' // In real app, get from auth context
    const userName = 'You'

    // Mock new message - replace with actual database insert
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      activityId,
      userId,
      userName,
      content,
      timestamp: new Date().toISOString(),
      isCurrentUser: true,
      replyTo
    }

    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100))

    // Return the created message
    return {
      message: newMessage,
      success: true
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid input',
        data: error.errors
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to send message'
    })
  }
})