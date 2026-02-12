import "./App.css";
import { useState, MouseEventHandler, useEffect } from "react";
import ReactMarkdown from "react-markdown"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { useChat } from "./lib/useChat";
import { ConversationId } from "@/server/storage";


function App() {
  const [input, setInput] = useState("")
  const { chat, conversations, sendMessage, fetchConversation, fetchConversations } = useChat()

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value)
  }

  const handleClick: MouseEventHandler = (e) => {
    sendMessage(input)
    setInput("")
  }

  const handleConversationClick = (id: ConversationId) => {
    fetchConversation(id)
  }

  useEffect(() => {
    fetchConversations()
  }, [])

  return (
    <>
      <h1>good title here</h1>
      <h2>current id: {(chat) ? chat.id : "none"}</h2>
      <div>
        <ScrollArea className="text-window">
          {!chat && <div>loading...</div>}
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
        <Button onClick={handleClick}>Send</Button>
        {conversations && conversations.map((conversation, index) => (
          <Button onClick={() => handleConversationClick(conversation.id)}>
            {conversation.id}
          </Button>
        ))}
      </div>
    </>
  )
}

export default App;