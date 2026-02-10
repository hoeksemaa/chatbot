import express from "express";
import ViteExpress from "vite-express";

import 'dotenv/config'

const app = express();

async function callAnthropic() {
  const api_key = process.env['ANTHROPIC_API_KEY'] as string
  const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': api_key,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        "model": "claude-haiku-4-5-20251001",
        "max_tokens": 1000,
        "messages": [
          {
            "role": "user", 
            "content": "hello! my name's john. how do i clean dishes better?"
          }
        ]
      })
    })
    const data = await response.json()
    console.log(data)
}

app.get("/hello", (_, res) => {
  //res.send("Hello Vite + React + TypeScript!");
  callAnthropic()
});

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);