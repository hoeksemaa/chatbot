import 'dotenv/config'
import express from "express";
import { Request, Response, NextFunction } from "express"
import ViteExpress from "vite-express";
import Anthropic from "@anthropic-ai/sdk";
import type { Role, ConversationId, Message, Conversation } from "./storage.ts"
import { InMemoryStorage, SqliteStorage } from "./storage"
import { getGameById, buildSystemPrompt } from "./games"
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

app.post("/create-game", requireAuth, (req, res) => {
  const { gameId } = req.body
  const game = getGameById(gameId)
  if (!game) {
    return res.status(400).json({ error: "unknown gameId" })
  }

  const conversation = conversations.createConversation(req.userId!, gameId)

  // save opening narration as first assistant message
  const openingMessage: Message = { role: "assistant", content: game.openingNarration }
  conversations.addMessageToConversation(conversation.id, openingMessage)
  conversation.messages.push(openingMessage)

  res.json(conversation)
})

app.post("/message/:id", requireAuth, async (req, res) => {
  const id: ConversationId = req.params.id as string
  const message: Message = req.body

  const success = conversations.addMessageToConversation(id, message)
  if (!success) {
    throw new Error("adding Message to Conversation failed")
  }

  const conversation = conversations.getConversation(id)

  // build system prompt if this is a game conversation
  let system: string | undefined
  if (conversation.gameId) {
    const game = getGameById(conversation.gameId)
    if (game) system = buildSystemPrompt(game)
  }

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    ...(system ? { system } : {}),
    messages: conversation.messages
  })

  if (!response.content[0] || response.content[0].type != 'text') {
    throw new Error('expected text response from Claude')
  }

  let text = response.content[0].text

  // check for victory
  let victory = false
  if (text.includes('[VICTORY]')) {
    victory = true
    text = text.replace('[VICTORY]', '').trimEnd()
    conversations.setConversationStatus(id, 'won')
  }

  const claudeResponse: Message = { role: "assistant", content: text }
  conversations.addMessageToConversation(id, claudeResponse)

  res.json({ ...claudeResponse, victory })
})

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);