import express from "express";
import ViteExpress from "vite-express";
import 'dotenv/config'
import Anthropic from "@anthropic-ai/sdk";

const app = express();
const client = new Anthropic();
app.use(express.json())

const chatLog: Anthropic.MessageParam[] = []

app.post("/chat", async (req, res) => {
  try {
    // isolate and save the user input
    const userInputObj: Anthropic.MessageParam = req.body
    chatLog.push(userInputObj)

    // get claude response
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: chatLog
    })

    // isolate and save claude response
    if (!response.content[0] || response.content[0].type != 'text') {
      throw new Error('expected text response from Claude')
    }
    const claudeResponseObj: Anthropic.MessageParam = { "role": "assistant", "content": response.content[0].text }
    chatLog.push( claudeResponseObj )

    // send claude response
    res.send( claudeResponseObj )

  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "POST /chat endpoint broke" })
  }
})

/*
app.post("/reset", (_, res) => {
  try {

  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "POST /reset endpoint broke" })
  }
})
*/

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);