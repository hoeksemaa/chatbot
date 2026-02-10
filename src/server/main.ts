import express from "express";
import ViteExpress from "vite-express";
import 'dotenv/config'
import Anthropic from "@anthropic-ai/sdk";

const app = express();
const client = new Anthropic();
app.use(express.json())

/*
async function getClaudeResponse() {
  const message = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: "my name is john! how do i clean dishes better? I keep breaking them accidentally."
      }
    ]
  })
  return message.content
}
*/

/*
app.get("/hello", (_, res) => {
  //res.send("Hello Vite + React + TypeScript!");
  callAnthropic()
});
*/

app.post("/chat", async (req, res) => {
  try {
    console.log("REQ BODY: ", req.body)
    const userInput = req.body.userInput
    console.log(userInput)
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: userInput
        }
      ]
    })
    res.send(response.content)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "POST /chat endpoint broke" })
  }
})

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);