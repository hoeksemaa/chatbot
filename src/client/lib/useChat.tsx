import { Conversation, ConversationId, Message } from "@/server/storage"
import { useEffect, useState } from "react"
import { getConversation, getConversations, postCreateConversation, postMessage } from "./chatClient"

// a hook is encapsulated state and other react hooks
// and it is used to abstract logic in react components, to simplify them.
export function useChat() {
    const [chat, setChat] = useState<Conversation | null>(null)
    const [conversations, setConversations] = useState<Conversation[]>([])

    const appendMessage = (message: Message) => {
        setChat(prev => prev ? { ...prev, messages: [...prev.messages, message] } : prev)
    }

    const initializeConversation = async (): Promise<Conversation> => {
        const conversation = await postCreateConversation()
        setChat(conversation)
        return conversation
    }

    const sendMessage = async (input: string) => {
        // no chat loaded yet
        // home screen with no chat history
        let activeChat = chat

        if (!activeChat) { activeChat = await initializeConversation() }

        if (!activeChat) { throw new Error("weird; chat is still not initialized") }

        const userMessage: Message = { "role": "user", "content": input }
        appendMessage(userMessage)
        const claudeResponse = await postMessage(userMessage, activeChat.id)
        appendMessage(claudeResponse)

        fetchConversations()
    }

    const fetchConversation = async (id: ConversationId) => {
        const conversation = await getConversation(id)
        setChat(conversation)
    }

    const fetchConversations = async () => {
        console.log("fetching conversations PLURAL...")
        const conversations = await getConversations()
        setConversations(conversations)
    }

    return {
        chat: chat,
        conversations: conversations,
        sendMessage: sendMessage,
        fetchConversation: fetchConversation,
        fetchConversations: fetchConversations
    }
}