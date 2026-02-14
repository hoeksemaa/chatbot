import "./App.css";
import { useState, MouseEventHandler, useEffect } from "react";
import ReactMarkdown from "react-markdown"
import { CornerDownLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
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
      <div className="min-h-screen flex flex-col">

        {/* Action buttons — top bar */}
        <div className="flex justify-center gap-4 p-4">
          <Button onClick={handleNewChat}>New Adventure</Button>
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline">Cities</Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-amber-50/90 backdrop-blur-md border-amber-200/60">
              <SheetHeader>
                <SheetTitle className="text-stone-700">Cities</SheetTitle>
              </SheetHeader>
              {conversations?.map((c) => (
                <Button key={c.id} variant="ghost" className="text-stone-600 hover:text-stone-800 hover:bg-amber-100/50 justify-start" onClick={() => handleSidebarClick(c.id)}>
                  {c.gameId ? getGameById(c.gameId)?.city ?? c.id : c.id}
                </Button>
              ))}
            </SheetContent>
          </Sheet>
          <Button variant="outline" onClick={() => authClient.signOut().then(() => { window.location.href = "/" })}>Sign Out</Button>
        </div>

        {/* Terminal window */}
        <div className="flex-1 mx-[5%] mb-[5%] bg-amber-50/65 backdrop-blur-md text-stone-800 font-mono border border-amber-200/30 rounded-lg shadow-md flex flex-col overflow-hidden">

          {/* Messages */}
          <ScrollArea className="flex-1 p-6">
            {chat && chat.messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${message.role === "user" ? "flex justify-end items-start gap-1" : "text-left"}`}
              >
                {message.role === "user" && <span className="text-green-700 font-mono text-sm leading-relaxed shrink-0">&gt;</span>}
                <div className={`terminal-message max-w-[80%] text-left text-sm leading-relaxed ${message.role === "user" ? "text-green-700" : ""}`}>
                  <ReactMarkdown>{message.content as string}</ReactMarkdown>
                </div>
              </div>
            ))}
            {victory && (
              <div className="bg-green-900/90 text-white text-center p-6 rounded border border-green-700 mx-6 mb-4">
                <h2 className="text-2xl font-bold">Victory!</h2>
                <p className="text-stone-300 mt-1">You completed the adventure.</p>
                <Button className="mt-4" onClick={handleNewChat}>Play Again</Button>
              </div>
            )}
          </ScrollArea>

          {/* Input area — bottom of terminal */}
          {!victory && (
            <div className="relative border-t border-amber-200/30 bg-amber-50/65 backdrop-blur-md flex items-start">
              <span className="text-green-700 font-mono pl-3 pt-2 select-none">&gt;</span>
              <Textarea
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="What do you do?"
                className="resize-none bg-transparent border-0 text-green-700 font-mono pl-1 pr-12 focus-visible:ring-0 focus-visible:border-0 min-h-[60px] shadow-none placeholder:text-green-700/40"
              />
              <Button
                onClick={handleClick}
                size="icon"
                className="absolute bottom-2 right-2 h-8 w-8"
                disabled={!input.trim()}
              >
                <CornerDownLeft className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default App;