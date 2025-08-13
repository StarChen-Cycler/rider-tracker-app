# Chat System Documentation

## Overview
A complete real-time chat system for the Rider Tracker App, built with Nuxt 3 architecture following the layer rules for maximum maintainability and scalability.

## Architecture

### Core Principles
- **Zero business logic in pages** - All logic encapsulated in composables
- **API boundary enforcement** - All data via `$fetch('/api/v1/...')`
- **Type safety** - Full TypeScript with strict interfaces
- **Single Responsibility** - Each file has one clear purpose
- **Mobile-first** - Optimized for mobile UX with safe area handling

### Directory Structure
```
rider-tracker-app/
├── pages/
│   ├── chats.vue                    # Activities list page
│   ├── chat/[id]/index.vue         # Chat room detail page
│   └── chat/[id]/details.vue       # Activity details page
├── server/api/v1/chat/
│   ├── activities.get.ts           # List activities with chat
│   ├── activities/[id]/index.get.ts # Activity details
│   ├── activities/[id]/messages.get.ts # Fetch messages
│   └── activities/[id]/messages.post.ts # Send message
├── composables/
│   ├── useChatActivities.ts        # Activity data management
│   ├── useChatActivity.ts          # Single activity state
│   ├── useChatMessages.ts          # Messages management
│   ├── useChatInput.ts             # Input handling
│   ├── useChatUI.ts                # UI state management
│   ├── useChatNavigation.ts        # Navigation utilities
│   └── useChatService.ts           # Real-time service
└── types/
    └── chat.ts                     # TypeScript interfaces
```

## Pages

### Activities List (`/chat`)
- **Purpose**: Display all activities with chat functionality
- **Features**:
  - Search and filter activities
  - Real-time unread counts
  - Activity metadata display
  - Two action buttons per activity:
    - **Detail Information** - Navigate to activity details page
    - **Chatroom** - Navigate to chat room
  - Navigation to chat rooms and activity details
- **Composables Used**:
  - `useChatActivities` - Data fetching
  - `useChatSearch` - Search functionality
  - `useChatNavigation` - Navigation helpers

### Chat Room (`/chat/[id]`)
- **Purpose**: Real-time messaging interface for specific activity
- **Features**:
  - Real-time message updates
  - Typing indicators
  - Activity details modal (quick view)
  - Responsive input area
  - Auto-scroll to new messages

### Activity Details (`/chat/[id]/details`)
- **Purpose**: Full activity information display
- **Features**:
  - Complete activity metadata
  - Route information with waypoints
  - Participant list
  - Activity description
  - Navigation to chat room
  - Back navigation to activities list
- **Composables Used**:
  - `useChatActivity` - Activity data
  - `useChatMessages` - Message management
  - `useChatInput` - Input handling
  - `useChatUI` - UI state
  - `useChatService` - Real-time features

## API Endpoints

### GET `/api/v1/chat/activities`
- **Purpose**: Fetch activities list with chat support
- **Query Parameters**:
  - `search` - Filter by title/type
  - `limit` - Pagination limit (1-100)
  - `offset` - Pagination offset
- **Response**: `{ activities: ChatActivity[], total: number, hasMore: boolean }`

### GET `/api/v1/chat/activities/[id]`
- **Purpose**: Get specific activity details
- **Response**: `ChatActivity` object
- **Error Handling**: 404 for invalid ID, 400 for format errors

### GET `/api/v1/chat/activities/[id]/messages`
- **Purpose**: Fetch messages for activity chat
- **Query Parameters**:
  - `limit` - Message limit (1-100)
  - `before` - Load older messages
  - `after` - Load newer messages
- **Response**: `{ messages: ChatMessage[], hasMore: boolean, total: number }`

### POST `/api/v1/chat/activities/[id]/messages`
- **Purpose**: Send new message
- **Body**: `{ content: string, replyTo?: string }`
- **Response**: `{ message: ChatMessage, success: boolean }`
- **Validation**: Content length 1-1000 chars

## Composables

### Core Data Management
- **`useChatActivities`** - Activities list state and fetching
- **`useChatActivity`** - Single activity state management
- **`useChatMessages`** - Messages state, fetching, and sending

### UI & Interaction
- **`useChatInput`** - Text input handling with typing indicators
- **`useChatUI`** - Modal and UI state management
- **`useChatNavigation`** - Navigation and formatting utilities
- **`useChatService`** - Real-time WebSocket simulation

### Specialized
- **`useChatSearch`** - Search functionality for activities
- **`useChatFiltering`** - Filter activities by criteria

## Types

```typescript
interface ChatActivity {
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
}

interface ChatMessage {
  id: string
  activityId: string
  userId: string
  userName: string
  avatar?: string
  content: string
  timestamp: string
  isCurrentUser: boolean
  replyTo?: string
}

interface ChatRoom {
  id: string
  activityId: string
  title: string
  participants: ChatParticipant[]
  lastMessage?: ChatMessage
  unreadCount: number
  isActive: boolean
}

interface ChatParticipant {
  userId: string
  userName: string
  avatar?: string
  isOnline: boolean
  lastSeen?: string
}
```

## Mobile UX Features

### Responsive Design
- **Breakpoints**: xs(320), sm(640), md(768), lg(1024), xl(1280), xxl(1536)
- **Touch targets**: Minimum 44px for accessibility
- **Safe areas**: iOS/Android safe area handling
- **Thumb reach**: Primary actions in thumb-friendly zones

### Interaction Patterns
- **Pull-to-refresh**: Swipe down to refresh messages
- **Infinite scroll**: Load older messages automatically
- **Keyboard handling**: Input grows with content, auto-scroll
- **Typing indicators**: Real-time "..." when others type
- **Status bar**: Online participants count

## Usage Examples

### Basic Activity List
```vue
<script setup lang="ts">
const { activities, loading, fetchActivities } = useChatActivities()
const { enterChat } = useChatNavigation()

onMounted(() => fetchActivities())
</script>

<template>
  <div v-for="activity in activities" :key="activity.id" @click="enterChat(activity)">
    {{ activity.title }} - {{ activity.unreadCount }} new
  </div>
</template>
```

### Chat Room Implementation
```vue
<script setup lang="ts">
const route = useRoute()
const activityId = computed(() => route.params.id as string)

const { activity, fetchActivity } = useChatActivity()
const { messages, sendMessage } = useChatMessages()
const { newMessage } = useChatInput()

onMounted(async () => {
  await fetchActivity(activityId.value)
  await fetchMessages(activityId.value)
})
</script>
```

### Real-time Features
```typescript
const { connect, handleNewMessage } = useChatService()

// Connect to room
connect(activityId.value)

// Listen for new messages
const unsubscribe = handleNewMessage((message) => {
  addMessage(message)
})

// Cleanup
onUnmounted(() => unsubscribe())
```

## Development Workflow

### Setup Commands
```bash
# Start development server
pnpm dev

# Test chat system
# Navigate to /chat for activities list
# Each activity has two buttons:
# - Detail Information button → activity details page
# - Chatroom button → chat room
# Test messaging and real-time features
```

### Adding New Features
1. **API Layer**: Add endpoint in `server/api/v1/chat/`
2. **Composables**: Create new composable in `composables/`
3. **Types**: Update `types/chat.ts` if needed
4. **Pages**: Update relevant pages with new functionality
5. **Testing**: Test on both desktop and mobile devices

### Performance Optimizations
- **Lazy loading**: Messages paginated by 50 items
- **Debounced typing**: 1-second delay on typing indicators
- **Virtual scrolling**: For large message lists
- **Image optimization**: WebP/AVIF for avatars
- **Caching**: Client-side caching for activities and messages

## Security Considerations

### Authentication
- All routes protected by `middleware: 'auth'`
- User context validated in API endpoints
- Row-level security on database queries

### Data Validation
- **Zod schemas** for all API inputs
- **Content sanitization** for messages
- **Rate limiting** on message sending
- **Size limits** for messages (1KB max)

### Privacy
- **User consent** for location sharing
- **Activity privacy** settings respected
- **Message encryption** ready for implementation
- **GDPR compliance** for data deletion

## Error Handling

### Client-side
- **Graceful fallbacks** for network issues
- **Retry logic** with exponential backoff
- **User-friendly messages** for common errors
- **Offline detection** with sync when online

### Server-side
- **Comprehensive logging** for debugging
- **Error boundaries** in composables
- **Validation errors** returned to client
- **Database connection** pooling and health checks

## Future Enhancements

### Phase 2 Features
- **File sharing** (images, routes)
- **Voice messages** audio recording
- **Message reactions** with emojis
- **Rich media** links and previews
- **Group management** participant controls

### Phase 3 Features
- **Push notifications** for new messages
- **Presence system** real-time online status
- **Message search** within conversations
- **Voice/video calls** WebRTC integration
- **End-to-end encryption** for privacy

## Testing Checklist

### Functional Testing
- [ ] Activities list loads correctly
- [ ] Search filters activities properly
- [ ] Activity details page loads correctly
- [ ] Two action buttons display on each activity card
- [ ] Detail Information button navigates to activity details
- [ ] Chatroom button navigates to chat room
- [ ] Chat room loads with messages
- [ ] Messages send successfully
- [ ] Typing indicators work
- [ ] Navigation between pages smooth
- [ ] Error states handled gracefully

### Mobile Testing
- [ ] Touch targets are accessible
- [ ] Keyboard doesn't cover content
- [ ] Safe areas respected on iOS/Android
- [ ] Swipe gestures work
- [ ] Offline mode handled
- [ ] Performance on slow networks

### Security Testing
- [ ] Authentication required
- [ ] Input validation works
- [ ] Rate limiting effective
- [ ] XSS prevention in place
- [ ] CSRF protection enabled