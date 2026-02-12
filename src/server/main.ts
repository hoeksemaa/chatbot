import express from "express";
import ViteExpress from "vite-express";
import 'dotenv/config'
import Anthropic from "@anthropic-ai/sdk";
import type { Role, ConversationId, Message, Conversation } from "./storage.ts"
import { InMemoryStorage } from "./storage"

const app = express();
const client = new Anthropic();
app.use(express.json())

let conversations = new InMemoryStorage()

app.get("/conversation/:id", async (req, res) => {
  const id = req.params.id
  const conversation = conversations.getConversation(id)
  res.json(conversation)
})

app.get("/conversations", (req, res) => {
  res.json(conversations.getConversations())
})

app.post("/create", (req, res) => {
  const conversation = conversations.createConversation()
  res.json(conversation)
})

app.post("/message/:id", async (req, res) => {
  // extract ID 
  const id: ConversationId = req.params.id
  const message: Message = req.body

  // save user message
  const success = conversations.addMessageToConversation(id, message)
  if (!success) {
    throw new Error("adding Message to Conversation failed")
  }

  // get claude response
  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    messages: conversations.getConversation(id).messages
  })

  // save claude response
  if (!response.content[0] || response.content[0].type != 'text') {
    throw new Error('expected text response from Claude')
  }
  const claudeResponse: Message = { "role": "assistant", "content": response.content[0].text }
  conversations.addMessageToConversation(id, claudeResponse)

  // send claude response
  res.json(claudeResponse)
})

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);