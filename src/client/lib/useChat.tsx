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

    const initializeChat = () => {
        async function initializeConversation() {
            const conversation = await postCreateConversation()
            setChat(conversation)
        }
        if (!chat) initializeConversation()
    }

    const sendMessage = async (input: string) => {
        if (!chat) {
            throw new Error("no chat found")
        }
        const userMessage: Message = { "role": "user", "content": input }
        appendMessage(userMessage)
        const claudeResponse = await postMessage(userMessage, chat.id)
        appendMessage(claudeResponse)
    }

    const loadConversations = async () => {
        const conversations = await getConversations()
        setConversations(conversations)
    }

    const fetchConversation = async (id: ConversationId) => {
        const conversation = await getConversation(id)
        setChat(conversation)
    }

    // initialize chat whenever a component mounts that is using useChat
    //useEffect(initializeChat, [])
    useEffect(() => {
        initializeChat()
        loadConversations()
    }, [])

    return {
        chat: chat,
        conversations: conversations,
        sendMessage: sendMessage,
        fetchConversation: fetchConversation,
        //loadConversations: loadConversations
    }
}