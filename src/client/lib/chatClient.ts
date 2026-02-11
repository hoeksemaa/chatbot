import { Conversation, Message } from "@/server/storage";

// create chat
export async function createConversation(): Promise<Conversation> {
    const response = await fetch("/create", { method: "POST" })
    const data = await response.json()
    return data
}

// send message
/*
async function sendMessage(message: Message){
    
}
*/