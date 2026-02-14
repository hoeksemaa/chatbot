import { v4 as uuid } from 'uuid'
import Database from 'better-sqlite3'

export type Role = "user" | "assistant"
export type ConversationId = string

export interface Message {
    role: Role
    content: string
}

export interface MessageRow {
    id: number,
    conversationId: ConversationId,
    role: Role
    content: string
}

export interface Conversation {
    id: ConversationId
    messages: Message[]
}

export interface ConversationRow {
    id: ConversationId,
    title: string,
    userId: string
}

export interface Storage {
    createConversation(userId: string): Conversation
    getConversation(id: ConversationId): Conversation
    getConversations(userId: string): Conversation[]
    addMessageToConversation(id: ConversationId, message: Message): boolean
}

export class InMemoryStorage implements Storage {
    conversationMap: Map<ConversationId, Conversation>

    constructor() {
        this.conversationMap = new Map()
    }

    // saves new conversation and returns it
    createConversation(userId: string): Conversation {
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
    getConversations(userId: string): Conversation[] {
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

export class SqliteStorage implements Storage {
    db: Database.Database

    constructor(dbPath: string = 'chatbot.db') {
        this.db = new Database(dbPath)
        this.db.exec(
            `CREATE TABLE IF NOT EXISTS conversations (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL, 
                userId TEXT NOT NULL
            )`
        )
        this.db.exec(
            `CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                conversationId INTEGER,
                role TEXT NOT NULL,
                content TEXT NOT NULL
            )`
        )
    }

    createConversation(userId: string): Conversation {
        const id: ConversationId = uuid()
        const messages: Message[] = []

        // perform conversation table row add
        const insertConversation = this.db.prepare('INSERT INTO conversations (id, title, userId) VALUES (?, ?, ?)')
        insertConversation.run(id, "PLACEHOLDER_TITLE", userId)

        const conversation: Conversation = { id, messages }
        return conversation
    }

    getConversation(id: ConversationId): Conversation {
        // search for conversation in database
        const conversationRows: ConversationRow = this.db.prepare(`SELECT * FROM conversations WHERE id = ?`).get(id) as ConversationRow
        if (!conversationRows) { throw new Error(`no conversation in conversations with id=${id} found`) }

        const messageRows: MessageRow[] = this.db.prepare(`SELECT * FROM messages WHERE conversationId = ?`).all(id) as MessageRow[]
        //console.log("selectedMessages: ", messageRows)
        if (!messageRows) { throw new Error(`no elements in messages with conversationId=${id} found`) }

        const messages: Message[] = messageRows.map((messageRow) => ({
            role: messageRow.role,
            content: messageRow.content
        }))
        //console.log("messages: ", messages)
        return { id: id, messages: messages }
    }

    getConversations(userId: string): Conversation[] {
        const conversations: Conversation[] = []

        // collect all conversations and messages
        let conversationRows: ConversationRow[]
        if (userId) {
            conversationRows = this.db.prepare(
                `SELECT * FROM conversations WHERE userId = ?`
            ).all(userId) as ConversationRow[]
        } else {
            conversationRows = this.db.prepare(
                `SELECT * FROM conversations`
            ).all() as ConversationRow[]
        }

        const messageRows: MessageRow[] = this.db.prepare(`SELECT * FROM messages`).all() as MessageRow[]

        // construct each conversation iteratively
        for (let conversationRow of conversationRows) {
            const conversationId: ConversationId = conversationRow.id
            const messagesById: MessageRow[] = messageRows.filter((messageRow) => (messageRow.conversationId == conversationId))
            const messages: Message[] = messagesById.map((messageRow) => ({
                role: messageRow.role,
                content: messageRow.content
            }))
            const conversation = { id: conversationId, messages: messages }
            conversations.push(conversation)
        }

        return conversations
    }

    addMessageToConversation(id: ConversationId, message: Message): boolean {
        const insertMessage = this.db.prepare(
            'INSERT INTO messages (conversationId, role, content) VALUES (?, ?, ?)'
        )
        insertMessage.run(id, message.role, message.content)
        return true
    }
}