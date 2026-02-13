import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryStorage, Message, SqliteStorage } from './storage'

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

    it('adds a new message to a conversation', () => {
        const conversation = storage.createConversation()
        expect(conversation.id).toBeDefined()
        expect(typeof conversation.id).toBe('string')
        expect(conversation.messages).toEqual([])

        const message: Message = { role: "user", content: "need hot dog" }
        const success = storage.addMessageToConversation(conversation.id, message)
        expect(success).toBe(true)
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
        const message: Message = { role: 'user', content: 'Hello!' }

        const success = storage.addMessageToConversation(conversation.id, message)

        expect(success).toBe(true)
        const updated = storage.getConversation(conversation.id)
        expect(updated.messages).toHaveLength(1)
        expect(updated.messages[0]).toEqual(message)
    })
})

describe('SqliteStorage', () => {
    let storage: SqliteStorage

    beforeEach(() => {
        storage = new SqliteStorage(':memory:')
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

    it('adds a message to a conversation', () => {
        const conversation = storage.createConversation()
        expect(conversation.id).toBeDefined()
        expect(typeof conversation.id).toBe('string')
        expect(conversation.messages).toEqual([])

        const message: Message = { role: "user", content: "need hot dog" }
        const success = storage.addMessageToConversation(conversation.id, message)
        expect(success).toBe(true)
    })

    it('adds 3 messages to a conversation and retrieves the conversation', () => {
        // create conversation
        const conversation1 = storage.createConversation()
        expect(conversation1.messages).toEqual([])

        // add 3 messages
        const message1: Message = { role: "user", content: "need hot dog" }
        const success1 = storage.addMessageToConversation(conversation1.id, message1)
        expect(success1).toBe(true)
        const message2: Message = { role: "assistant", content: "here are some hot dog options!" }
        const success2 = storage.addMessageToConversation(conversation1.id, message2)
        expect(success2).toBe(true)
        const message3: Message = { role: "user", content: "no moneyyy" }
        const success3 = storage.addMessageToConversation(conversation1.id, message3)
        expect(success3).toBe(true)

        // retrieve the conversation
        const conversation2 = storage.getConversation(conversation1.id)
        expect(conversation2.id).toBeDefined()
        expect(conversation2.id).toBe(conversation1.id)
        expect(conversation2.messages).toHaveLength(3)
        expect(conversation2.messages[0]).toEqual(message1)
        expect(conversation2.messages[1]).toEqual(message2)
        expect(conversation2.messages[2]).toEqual(message3)
    })

    it('retrieves all conversations', () => {
        const conv1 = storage.createConversation()
        const conv2 = storage.createConversation()

        const conversations = storage.getConversations()

        expect(conversations).toHaveLength(2)
        expect(conversations).toContainEqual(conv1)
        expect(conversations).toContainEqual(conv2)
    })
})
