import "./App.css";
import { useState, MouseEventHandler, useEffect } from "react";
import ReactMarkdown from "react-markdown"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useChat } from "./lib/useChat";
import { ConversationId } from "@/server/storage";
import { useNavigate, useParams } from "react-router";
import Login from "./Login";

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [input, setInput] = useState("")
  const [sheetOpen, setSheetOpen] = useState(false)
  const { chat, conversations, sendMessage, fetchConversation, fetchConversations, clearChat } = useChat()
  let { conversationId } = useParams()
  let navigate = useNavigate()

  // send message
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value)
  }

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key == "Enter" && !e.shiftKey && input.trim()) {
      e.preventDefault()
      const conversationId = await sendMessage(input)
      navigate(`/conversation/${conversationId}`, { replace: true })
      setInput("")
    }
  }

  const handleClick: MouseEventHandler = async (e) => {
    if (input.trim()) {
      const conversationId = await sendMessage(input)
      navigate(`/conversation/${conversationId}`, { replace: true })
      setInput("")
    }
  }

  const handleSidebarClick = (id: ConversationId) => {
    console.log("handling sidebar click")
    navigate(`/conversation/${id}`)
    setSheetOpen(false)
  }

  const handleNewChat = () => {
    navigate(`/new`)
    setInput("")
  }

  useEffect(() => {
    if (conversationId) {
      fetchConversation(conversationId)
    } else {
      clearChat()
    }
  }, [conversationId])

  useEffect(() => {
    fetchConversations()
  }, [])

  if (!loggedIn) {
    return (<Login />)
  } else {
    return (
      <>
        <h1>good title here</h1>
        <h2>current id: {(chat) ? chat.id : "none"}</h2>
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
            onKeyDown={handleKeyDown}
          />
          <Button onClick={handleClick}>Send</Button>
          <Button onClick={handleNewChat}>New Chat</Button>
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline">Chats</Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Chats</SheetTitle>
              </SheetHeader>
              {conversations?.map((c) => (
                <Button key={c.id} variant="ghost" onClick={() => handleSidebarClick(c.id)}>
                  {c.id}
                </Button>
              ))}
            </SheetContent>
          </Sheet>

        </div>
      </>
    )
  }
}

export default App;