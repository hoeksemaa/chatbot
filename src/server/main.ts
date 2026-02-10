import express from "express";
import ViteExpress from "vite-express";
import 'dotenv/config'
import Anthropic from "@anthropic-ai/sdk";

const app = express();
const client = new Anthropic();

async function callAnthropic() {
  //const api_key = process.env['ANTHROPIC_API_KEY'] as string
  const message = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: "my name is john! how do i clean dishes better?"
      }
    ]
  })
  console.log(message.content)
}

app.get("/hello", (_, res) => {
  //res.send("Hello Vite + React + TypeScript!");
  callAnthropic()
});

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);