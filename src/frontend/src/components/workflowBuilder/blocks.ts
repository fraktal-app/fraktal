import { BrainCircuit, Github, Mail, MessageSquare, Send } from "lucide-react"

import discord from "../../assets/discord.png"
import github from "../../assets/github.png"
import email from "../../assets/email.png"
// import metamask from "../../assets/metamask.png"
// import notion from "../../assets/notion.png"
import telegram from "../../assets/telegram.png"
// import etherium from "../../assets/eth.png"
//import twitter from "../../assets/twitter.jpg"
import ai from "../../assets/ai.png"
import type { AppBlock } from "./types"


export const appBlocks: AppBlock[] = [
  { type: "discord", label: "Discord", icon: MessageSquare, iconUrl: discord, color: "white", category: "trigger" },
  { type: "telegram", label: "Telegram", icon: Send, iconUrl: telegram, color: "white", category: "trigger" },
  { type: "email", label: "Email", icon: Mail, iconUrl: email, color: "white", category: "action" },
  { type: "github", label: "GitHub", icon: Github, iconUrl: github, color: "white", category: "trigger" },
  // { type: "wallet", label: "Wallet Tracking", icon: TrendingUp, iconUrl: metamask, color: "white", category: "trigger"},
  // { type: "token", label: "Token Price", icon: Coins , iconUrl: etherium, color: "white", category: "trigger" },
  // { type: "rss", label: "RSS Feed", icon: Coins , iconUrl: etherium, color: "white", category: "trigger" },
  { type: "discord",label: "Discord",icon: MessageSquare,iconUrl: discord,color: "white",category: "action"},
  // { type: "notion",label: "Notion",icon: FileText,iconUrl: notion,color: "white",category: "action"},
  { type: "telegram",label: "Telegram",icon: Send,iconUrl: telegram,color: "white",category: "action",},
  // { type: "webhook", label: "Post to Webhook", icon: Webhook, color: "white", category: "action" },
  // { type: "twitter",label: "Twitter",icon: X,iconUrl: twitter,color: "white",category: "action",},
  { type: "ai",label: "AI",icon: BrainCircuit,iconUrl: ai,color: "white",category: "action",},
  // { type: "api",label: "API Call",icon: Mail,iconUrl: gmail,color: "white",category: "action",}
]