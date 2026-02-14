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
import { getGameById } from "@/server/games";
import { Navigate, useNavigate, useParams } from "react-router";
import { authClient } from "./lib/authClient";

function App() {
  const { data: session, isPending } = authClient.useSession()
  const [input, setInput] = useState("")
  const [sheetOpen, setSheetOpen] = useState(false)
  const { chat, conversations, victory, sendMessage, fetchConversation, fetchConversations, clearChat } = useChat()
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

  if (isPending) return <div>Loading...</div>
  if (!session) return <Navigate to="/" replace />

  const game = chat?.gameId ? getGameById(chat.gameId) : undefined

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
      style={game ? { backgroundImage: `url(${game.image})` } : undefined}
    >
      <div className={game ? "bg-background/85 backdrop-blur-sm min-h-screen" : "min-h-screen"}>
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
        {victory && (
          <Card className="bg-green-900 text-white text-center p-6 mb-4">
            <h2 className="text-2xl font-bold">Victory!</h2>
            <p className="text-muted-foreground mt-1">You completed the adventure.</p>
            <Button className="mt-4" onClick={handleNewChat}>Play Again</Button>
          </Card>
        )}
        {!victory && (
          <>
            <Textarea
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
            <Button onClick={handleClick}>Send</Button>
          </>
        )}
        <Button onClick={handleNewChat}>New Adventure</Button>
        <Button variant="outline" onClick={() => authClient.signOut().then(() => { window.location.href = "/" })}>Sign Out</Button>
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
      </div>
    </div>
  )
}

export default App;