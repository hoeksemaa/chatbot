import "./App.css";
import { useState, MouseEventHandler } from "react";
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
import { useChat } from "./lib/useChat";


function App() {
  const [input, setInput] = useState("")
  const { chat, sendMessage } = useChat()

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value)
  }

  const handleClick: MouseEventHandler = (e) => {
    sendMessage(input)
  }

  // TODO: EXAMINE (MESSAGE, INDEX)
  return (
    <>
      <h1>bingobot</h1>
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
      </div>
    </>
  )
}

export default App;