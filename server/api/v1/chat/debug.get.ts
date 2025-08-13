export default defineEventHandler(async (event) => {
  return {
    message: 'Chat API is working!',
    endpoints: [
      'GET /api/v1/chat/activities',
      'GET /api/v1/chat/activities/:id',
      'GET /api/v1/chat/activities/:id/messages',
      'POST /api/v1/chat/activities/:id/messages'
    ],
    sampleActivities: [
      '550e8400-e29b-41d4-a716-446655440001',
      '550e8400-e29b-41d4-a716-446655440002',
      '550e8400-e29b-41d4-a716-446655440003',
      '550e8400-e29b-41d4-a716-446655440004'
    ]
  }
})