import "./App.css";
import { useState } from "react";
import Anthropic from "@anthropic-ai/sdk";
import ReactMarkdown from "react-markdown"

const chatLog: Anthropic.MessageParam[] = []

function App() {
  const [input, setInput] = useState("")
  const [chatLog, setChatLog] = useState<Anthropic.MessageParam[]>([])

  function handleInputChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(event.target.value)
  }

  async function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    // isolate and save user message
    const userMessage: Anthropic.MessageParam = { "role": "user", "content": input }
    setChatLog(prev => prev.concat(userMessage))

    // send post request
    const response = await fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userMessage)}
    )

    // isolate and save claude response 
    const claudeResponse: Anthropic.MessageParam = await response.json()
    setChatLog(prev => prev.concat(claudeResponse))
    setInput("")

    console.log("CHATLOG: ", chatLog)
  }

  async function handleReset() {
    // send post request
    const response = await fetch("http://localhost:3000/reset", {method: "POST"})
    const data = await response.json()
    console.log(data)

    // empty chat log
    setChatLog(prev => [])
    setInput("")
  }

  return (
    <>
      <h1>bingobot</h1>
      <div>
        <div className="text-window">
          {chatLog.map((message) => (
            <ReactMarkdown>{message.content as string}</ReactMarkdown>
          ))}
        </div>
        <textarea 
          value={input}
          onChange={handleInputChange}>
        </textarea>
        <button onClick={handleClick}>Send</button>
        <button onClick={handleReset}>Reset</button>
      </div>
    </>
  )
}

export default App;