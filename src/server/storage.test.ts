import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryStorage } from './storage'

describe('InMemoryStorage', () => {
    let storage: InMemoryStorage

    beforeEach(() => {
        storage = new InMemoryStorage()
    })

    it('creates a new conversation with unique ID and empty messages', () => {
        const conversation = storage.createConversation()

        expect(conversation.id).toBeDefined()
        expect(typeof conversation.id).toBe('string')
        expect(conversation.messages).toEqual([])
    })

    it('creates conversations with unique IDs', () => {
        const conv1 = storage.createConversation()
        const conv2 = storage.createConversation()

        expect(conv1.id).not.toBe(conv2.id)
    })

    it('retrieves all conversations', () => {
        const conv1 = storage.createConversation()
        const conv2 = storage.createConversation()

        const conversations = storage.getConversations()

        expect(conversations).toHaveLength(2)
        expect(conversations).toContainEqual(conv1)
        expect(conversations).toContainEqual(conv2)
    })

    it('adds a message to a conversation', () => {
        const conversation = storage.createConversation()
        const message = { role: 'user' as const, content: 'Hello!' }

        const success = storage.addMessageToConversation(conversation.id, message)

        expect(success).toBe(true)
        const updated = storage.getConversation(conversation.id)
        expect(updated.messages).toHaveLength(1)
        expect(updated.messages[0]).toEqual(message)
    })
})
