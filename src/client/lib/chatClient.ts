import { Conversation, ConversationId, Message } from "@/server/storage";

// create chat
export async function postCreateConversation() {
    const response = await fetch("/create", { method: "POST" })
    const data = await response.json()
    return data
}

// send message
export async function postMessage(message: Message, id: ConversationId) {
    const response = await fetch(`/message/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message)
    })
    // this is Claude's response
    const data: Message = await response.json()
    return data
}