import 'dotenv/config'
import { betterAuth } from "better-auth"
import Database from "better-sqlite3"

export const auth = betterAuth({
    database: new Database("chatbot.db"),
    emailAndPassword: {
        enabled: true,
        autoSignIn: false
    }
})