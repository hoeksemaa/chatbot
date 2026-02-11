import { v4 as uuid } from 'uuid'

export type Role = "user" | "assistant"
export type ConversationId = string

export interface Message {
    role: Role
    content: string
}

export interface Conversation {
    id: ConversationId
    messages: Message[]
}

export interface Storage {
    createConversation(): Conversation
    getConversation(id: ConversationId): Conversation
    getConversations(): Conversation[]
    addMessageToConversation(id: ConversationId, message: Message): boolean
}

class InMemoryStorage implements Storage {
    conversations: Map<ConversationId, Conversation>

    constructor() {
        this.conversations = new Map()
    }

    createConversation(): Conversation {
        const id: ConversationId = uuid()
        const messages: Message[] = []
        const conversation = { id, messages }
        this.conversations.set(id, conversation)
        return conversation
    }

    getConversation(id: ConversationId): Conversation {
        const conversation = this.conversations.get(id)
        if (!conversation) {
            throw new Error("conversation is falsy (could be undefined)")
        }
        return conversation
    }

    getConversations(): Conversation[] {
        const conversationList = Array.from(this.conversations.values())
        return conversationList
    }

    addMessageToConversation(id: ConversationId, message: Message): boolean {
        let conversation = this.conversations.get(id)
        if (!conversation) {
            throw new Error("conversation is falsy (could be undefined)")
        }
        conversation.messages.push(message)
        this.conversations.set(id, conversation)
        return true
    }
}