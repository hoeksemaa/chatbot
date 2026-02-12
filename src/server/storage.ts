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

export class InMemoryStorage implements Storage {
    conversationMap: Map<ConversationId, Conversation>

    constructor() {
        this.conversationMap = new Map()
    }

    // saves new conversation and returns it
    createConversation(): Conversation {
        const id: ConversationId = uuid()
        const messages: Message[] = []
        const conversation = { id, messages }
        this.conversationMap.set(id, conversation)
        return conversation
    }

    // returns data
    getConversation(id: ConversationId): Conversation {
        const conversation = this.conversationMap.get(id)
        if (!conversation) {
            throw new Error("conversation is falsy (could be undefined)")
        }
        return conversation
    }

    // returns data
    getConversations(): Conversation[] {
        const conversationList = Array.from(this.conversationMap.values())
        return conversationList
    }

    // updates conversation, saves it, returns bool
    addMessageToConversation(id: ConversationId, message: Message): boolean {
        let conversation = this.conversationMap.get(id)
        if (!conversation) {
            throw new Error("conversation is falsy (could be undefined)")
        }
        conversation.messages.push(message)
        this.conversationMap.set(id, conversation)
        return true
    }
}