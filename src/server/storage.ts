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
    gameId?: string
    status?: string
}

export interface ConversationRow {
    id: ConversationId,
    title: string,
    userId: string,
    gameId: string | null,
    status: string
}

export interface Storage {
    createConversation(userId: string, gameId?: string): Conversation
    getConversation(id: ConversationId): Conversation
    getConversations(userId: string): Conversation[]
    addMessageToConversation(id: ConversationId, message: Message): boolean
    setConversationStatus(id: ConversationId, status: string): void
}

export class InMemoryStorage implements Storage {
    conversationMap: Map<ConversationId, Conversation>

    constructor() {
        this.conversationMap = new Map()
    }

    // saves new conversation and returns it
    createConversation(userId: string, gameId?: string): Conversation {
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

    setConversationStatus(id: ConversationId, status: string): void {
        const conversation = this.conversationMap.get(id)
        if (conversation) conversation.status = status
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
                userId TEXT NOT NULL,
                gameId TEXT,
                status TEXT NOT NULL DEFAULT 'active'
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

    createConversation(userId: string, gameId?: string): Conversation {
        const id: ConversationId = uuid()
        const messages: Message[] = []

        const insertConversation = this.db.prepare('INSERT INTO conversations (id, title, userId, gameId, status) VALUES (?, ?, ?, ?, ?)')
        insertConversation.run(id, "PLACEHOLDER_TITLE", userId, gameId ?? null, "active")

        const conversation: Conversation = { id, messages, gameId, status: "active" }
        return conversation
    }

    getConversation(id: ConversationId): Conversation {
        const row = this.db.prepare(`SELECT * FROM conversations WHERE id = ?`).get(id) as ConversationRow
        if (!row) { throw new Error(`no conversation in conversations with id=${id} found`) }

        const messageRows: MessageRow[] = this.db.prepare(`SELECT * FROM messages WHERE conversationId = ?`).all(id) as MessageRow[]

        const messages: Message[] = messageRows.map((messageRow) => ({
            role: messageRow.role,
            content: messageRow.content
        }))
        return { id: id, messages, gameId: row.gameId ?? undefined, status: row.status }
    }

    setConversationStatus(id: ConversationId, status: string): void {
        this.db.prepare('UPDATE conversations SET status = ? WHERE id = ?').run(status, id)
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
            const conversation = { id: conversationId, messages, gameId: conversationRow.gameId ?? undefined, status: conversationRow.status }
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