import { Conversation, ConversationId, Message } from "@/server/storage";

export async function postCreateConversation() {
    const response = await fetch("/create", { method: "POST" })
    const data = await response.json()
    return data
}

export async function postMessage(message: Message, id: ConversationId) {
    const response = await fetch(`/message/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message)
    })
    const data: Message = await response.json()
    return data
}

export async function getConversations() {
    const response = await fetch("/conversations")
    const data = await response.json()
    return data
}