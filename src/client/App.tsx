import "./App.css";
import { useState } from "react";

function App() {
  const [input, setInput] = useState("")
  const [chatLog, setChatLog] = useState([])

  function handleInputChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(event.target.value)
  }

  async function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    //event.preventDefault()
    const response = await fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userInput: input })}
    )
    const data = await response.json()
    console.log("SERVER RESPONSE: ", data)
  }

  return (
    <>
      <h1>johns chatbot o7</h1>
      <div>
        <textarea 
          value={input}
          onChange={handleInputChange}
        ></textarea>
        <button onClick={handleClick}>Send</button>
      </div>
    </>
  )
}

export default App;