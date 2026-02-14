import 'dotenv/config'
import express from "express";
import { Request, Response, NextFunction } from "express"
import ViteExpress from "vite-express";
import Anthropic from "@anthropic-ai/sdk";
import type { Role, ConversationId, Message, Conversation } from "./storage.ts"
import { InMemoryStorage, SqliteStorage } from "./storage"
import { toNodeHandler } from 'better-auth/node'
import { auth } from 'auth'

declare global {
  namespace Express {
    interface Request {
      userId?: string
    }
  }
}

const app = express();
const client = new Anthropic();
app.use(express.json())

//let conversations = new InMemoryStorage()
let conversations = new SqliteStorage()

async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const session = await auth.api.getSession({
    headers: new Headers(req.headers as Record<string, string>)
  })
  if (!session) {
    return res.status(401).json({ error: "unauthorized" })
  }
  req.userId = session.user.id
  next()
}

app.all('/api/auth/{*any}', toNodeHandler(auth));

app.get("/conversation/:id", requireAuth, async (req, res) => {
  const id: ConversationId = req.params.id as string
  const conversation = conversations.getConversation(id)
  res.json(conversation)
})

app.get("/conversations", requireAuth, (req, res) => {
  res.json(conversations.getConversations(req.userId!))
})

app.post("/create", requireAuth, (req, res) => {
  const conversation = conversations.createConversation(req.userId!)
  res.json(conversation)
})

app.post("/message/:id", requireAuth, async (req, res) => {
  // extract ID 
  const id: ConversationId = req.params.id as string
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