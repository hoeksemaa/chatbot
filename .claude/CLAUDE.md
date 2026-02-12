# CLAUDE.md

This file provides guidance to Claude Code when working with this chatbot project.

## Project Overview

A fullstack TypeScript chatbot application by John Hoeksema. Users can have multiple conversations with Claude AI, with conversation history persisted on the backend.

**Current Status:** Functional MVP with basic chat interface and conversation switching.

**Tech Stack:**
- **Frontend:** React 19 + TypeScript + Vite + TailwindCSS + shadcn/ui
- **Backend:** Express + Vite-Express + Anthropic SDK
- **Storage:** In-memory (planned: PostgreSQL/SQLite)
- **API:** Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)

## Architecture

### Directory Structure

```
src/
  client/               # React frontend
    App.tsx            # Main UI component
    lib/
      useChat.tsx      # React hook for chat state management
      chatClient.ts    # API client (fetch wrappers)
  server/              # Express backend
    main.ts           # Express server & API routes
    storage.ts        # Storage interface + InMemoryStorage
  components/ui/       # shadcn/ui components
  lib/                # Shared utilities (cn helper)
```

### Key Files

- **[src/server/storage.ts](src/server/storage.ts)**: Domain types (`Message`, `Conversation`) and storage abstraction
- **[src/server/main.ts](src/server/main.ts)**: Express API endpoints (`/conversations`, `/create`, `/message/:id`)
- **[src/client/lib/useChat.tsx](src/client/lib/useChat.tsx)**: React hook managing chat state and API calls
- **[src/client/lib/chatClient.ts](src/client/lib/chatClient.ts)**: Fetch wrapper functions for API

## API Endpoints

```
GET  /conversations        # List all conversations
GET  /conversation/:id     # Get single conversation
POST /create              # Create new conversation
POST /message/:id         # Send message, get Claude response
```

## Key Patterns & Conventions

### 1. **Storage Interface Pattern**

The `Storage` interface abstracts data persistence, allowing easy swapping from `InMemoryStorage` to SQL:

```typescript
interface Storage {
    createConversation(): Conversation
    getConversation(id: ConversationId): Conversation
    getConversations(): Conversation[]
    addMessageToConversation(id: ConversationId, message: Message): boolean
}
```

**Important:** API endpoints should use interface methods (e.g., `getConversations()`), NOT internal implementation details (e.g., `conversationMap`).

### 2. **Async State Pattern in React**

**Critical pattern to understand:** React state updates are asynchronous and don't take effect until the next render.

```typescript
// ❌ WRONG: chat will still be null after await
if (!chat) {
    await initializeConversation()  // calls setChat() inside
}
postMessage(chat.id)  // ❌ CRASH: chat is still null!

// ✅ CORRECT: Use returned value, not state
if (!chat) {
    activeChat = await initializeConversation()  // returns conversation
}
postMessage(activeChat.id)  // ✅ Works!
```

**Why:** `setChat(conversation)` schedules a state update for the next render. The `chat` variable doesn't update immediately in the current execution context.

**Solution:** Async functions that set state should also **return the value** so callers can use it immediately.

### 3. **API Client Pattern**

All API calls go through typed wrapper functions in `chatClient.ts`:

```typescript
export async function postMessage(message: Message, id: ConversationId): Promise<Message> {
    const response = await fetch(`/message/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message)
    })
    return await response.json()
}
```

## Known Technical Debt

### High Priority
1. **No error handling** - API calls can fail silently (see [useChat.tsx:37](src/client/lib/useChat.tsx#L37))
2. **No input validation** - Empty messages can be sent (see [useChat.tsx:35](src/client/lib/useChat.tsx#L35))
3. **State sync bug** - `appendMessage()` updates `chat` but not `conversations` array (messages disappear when switching conversations)
4. **Type coupling** - Frontend imports types from `/server/storage.ts` (should be in `/shared/types.ts`)
5. **No HTTP status codes** - Backend throws errors but doesn't return proper 4xx/5xx responses

### Medium Priority
6. **No loading states** - User can spam Send button
7. **No message metadata** - Messages lack `id`, `timestamp`, `createdAt`
8. **No conversation metadata** - Conversations lack `title`, `createdAt`, `updatedAt`
9. **Using index as React key** - Should use message IDs (see [App.tsx:55](src/client/App.tsx#L55))
10. **Inconsistent API naming** - Mix of REST (`/conversations`) and RPC (`/create`)

### Low Priority
11. **Redundant Map.set()** - In `addMessageToConversation` (see [storage.ts:61](src/server/storage.ts#L61))
12. **Defensive null checks** - `prev ? [...prev, item] : prev` when `prev` is initialized to `[]`
13. **Verbose return objects** - Can use shorthand: `return { chat, conversations }` instead of `return { chat: chat, conversations: conversations }`

## Working with John

### Learning Style
- **Likes deep dives:** Appreciates thorough explanations with the "why" behind recommendations
- **Values principles over recipes:** Wants to understand core concepts (e.g., async state timing) not just copy-paste fixes
- **Appreciates code smell analysis:** Actively asks for architecture reviews and refactoring guidance
- **Prefers clean code:** Questions patterns that "smell gross" and seeks elegant solutions
- **Hands-on learner:** Makes changes incrementally and asks follow-up questions

### Communication Preferences
- Use markdown formatting with code blocks for readability
- Provide both **problem explanation** and **concrete solutions**
- Use visual separators (headings, tables, lists) to organize information
- Include file/line references like `[file.ts:42](src/file.ts#L42)` for easy navigation
- Explain trade-offs when multiple approaches exist

### When Helping
1. **Read files first** - Don't suggest changes to code you haven't seen
2. **Explain the "why"** - Don't just fix, teach the underlying principle
3. **Show alternatives** - Present multiple options with trade-offs
4. **Be thorough but concise** - Comprehensive but well-organized responses
5. **Call out code smells proactively** - John appreciates honest assessment
6. **Use clear examples** - Side-by-side ❌/✅ comparisons work well

## Development Workflow

### Running the App
```bash
npm run dev    # Starts Vite dev server + Express backend
npm run build  # Production build
```

### Git Workflow
- **Main branch:** `main`
- **Current branch:** `database` (working on data persistence features)
- John uses `gh` CLI for PR management
- **Important:** PRs auto-update when you push to the branch (no need to recreate)

### Code Style
- **TypeScript strict mode** enabled
- **Functional components** with hooks (no class components)
- **Type annotations** on function returns preferred
- **Async/await** over promises (no `.then()` chains)
- **Const over let** when possible
- **Descriptive variable names** over abbreviations

## Future Plans

### Short Term
1. Fix state sync bug in `appendMessage()`
2. Add error handling and loading states
3. Add input validation
4. Move shared types to `/src/shared/types.ts`

### Medium Term
5. Add message and conversation metadata (IDs, timestamps)
6. Implement proper error responses with HTTP status codes
7. Add conversation titles (from first message or summary)
8. Sort conversations by last activity

### Long Term
9. **Replace InMemoryStorage with SQL** (PostgreSQL or SQLite)
10. Add user authentication
11. Add conversation search/filtering
12. Deploy to production

## Common Gotchas

### React State + Async
State updates don't happen immediately. Always return values from async functions that set state, don't rely on reading the state variable right after setting it.

### Storage Abstraction
Don't access `conversationMap` directly in API routes. Use `getConversations()` method to maintain abstraction.

### API Response Types
Frontend expects consistent JSON shapes. When adding new endpoints, define TypeScript types and use them on both sides.

### React Keys
Never use array index as `key` in `.map()`. Use unique, stable IDs (message.id, conversation.id).

## Questions?

If uncertain about architecture decisions, John prefers to discuss trade-offs rather than have assumptions made. Use AskUserQuestion or present options with pros/cons.
