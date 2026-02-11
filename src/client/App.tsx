import "./App.css";
import { useState, useEffect } from "react";
import Anthropic from "@anthropic-ai/sdk";
import ReactMarkdown from "react-markdown"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { Role, ConversationId, Message, Conversation } from "../server/storage"

function App() {
  const [input, setInput] = useState("")
  const [chat, setChat] = useState<Conversation | null>(null)

  function handleInputChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(event.target.value)
  }

  async function createChat() {
    const response = await fetch("http://localhost:3000/create", { method: "POST" })
    const data = await response.json()

    // update conversation ID
    setChat({ id: data.id, messages: [] })
    console.log("CHAT DATA:", data)
  }

  /*
  async function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    // collect and save user message
    const userMessage: Message = { role: "user", content: input }
    setChat(prev => prev.concat(userMessage))
  } 
  */

  useEffect(() => {
    createChat()
  }, [])

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

  //useEffect(() => {}, [])

  return (
    <>
      <h1>bingobot</h1>
      <div>
        <ScrollArea className="text-window">
          {chat && chat.messages.map((message, index) => (
            <Card key={index} className={`${message.role === "user" ? "user-bubble" : "assistant-bubble"}`}>
              <ReactMarkdown>{message.content as string}</ReactMarkdown>
            </Card>
          ))}
        </ScrollArea>
        <Textarea 
          value={input}
          onChange={handleInputChange}
        />
      </div>
    </>
  )
}

export default App;