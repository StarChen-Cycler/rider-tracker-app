import { z } from 'zod'

const paramsSchema = z.object({
  id: z.string().uuid('Invalid activity ID format'),
  userId: z.string().uuid('Invalid user ID format')
})

export default defineEventHandler(async (event) => {
  try {
    // Validate route parameters
    const params = getRouterParams(event)
    const { id, userId } = paramsSchema.parse(params)

    // TODO: Replace with actual authentication and authorization
    const currentUserId = 'current-user-id'
    const currentUserRole = 'owner' // Should come from auth context

    // Check permissions - owners and admins can remove members
    // Owners can remove anyone, admins can only remove members (not other admins or owners)
    if (!['owner', 'admin'].includes(currentUserRole)) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Insufficient permissions to remove participants'
      })
    }

    // Prevent self-removal if owner
    if (currentUserId === userId && currentUserRole === 'owner') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Cannot remove yourself as the owner'
      })
    }

    // TODO: Replace with actual database operations
    // 1. Check if activity exists
    // 2. Check if target user is a participant
    // 3. Check permissions based on roles
    // 4. Remove participant from activity
    // 5. Send notification to removed user

    return {
      success: true,
      message: 'Participant removed successfully',
      removedUserId: userId
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid request data',
        data: error.errors
      })
    }

    if (error.statusCode === 403 || error.statusCode === 400) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to remove participant'
    })
  }
})