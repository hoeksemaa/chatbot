import { Conversation } from "@/server/storage"
import { useEffect, useState } from "react"
import { createConversation } from "./chatClient"

// a hook is encapsulated state and other react hooks
// and it is used to abstract logic in react components, to simplify them.
export function useChat() {
    const [chat, setChat] = useState<Conversation | null>(null)

    const initializeChat = () => {
        async function initializeConversation() {
            const conversation = await createConversation()
            setChat(conversation)
        }
        if (!chat) initializeConversation()
    }

    // initialize chat whenever a component mounts that is using useChat
    useEffect(initializeChat, [])

    return {
        chat: chat,
        sendMessage: () => console.log("sorry, i have not implemented sendMessage yet")
    }
}


/*
async function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
  // if no chatID
 
  // if chatID
 
  // isolate and save user message
 
 
 
  const userMessage: Message = { "role": "user", "content": input }
  setChat(prev => prev.concat(userMessage))
 
  // send post request
  const response = await fetch("http://localhost:3000/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userMessage)}
  )
 
  // isolate and save claude response 
  const claudeResponse: Anthropic.MessageParam = await response.json()
  setChat(prev => prev.concat(claudeResponse))
  setInput("")
 
  console.log("CHATLOG: ", chatLog)
}
  */

/*
async function handleReset() {
  // send post request
  const response = await fetch("http://localhost:3000/reset", {method: "POST"})
  const data = await response.json()
  console.log(data)
 
  // empty chat log
  setChatLog(prev => [])
  setInput("")
}
*/

/*
async function loadConversations() {
  const response = await fetch("http://localhost:3000/chats")
  const data = await response.json()
  setChats
}
*/
