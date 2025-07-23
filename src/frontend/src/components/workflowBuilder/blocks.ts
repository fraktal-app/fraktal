import { BrainCircuit, Coins, Github, Mail, MessageSquare, Send, TrendingUp } from "lucide-react"

import discord from "../../assets/discord.png"
import github from "../../assets/github.png"
import email from "../../assets/email.png"
import wallet from "../../assets/wallet.png"
// import notion from "../../assets/notion.png"
import telegram from "../../assets/telegram.png"
import token from "../../assets/token.png"
//import twitter from "../../assets/twitter.jpg"
import ai from "../../assets/ai.png"
import type { AppBlock } from "./types"


export const appBlocks: AppBlock[] = [
  { type: "discord", label: "Discord", icon: MessageSquare, iconUrl: discord, color: "white", category: "trigger" },
  { type: "telegram", label: "Telegram", icon: Send, iconUrl: telegram, color: "white", category: "trigger" },
  { type: "email", label: "Email", icon: Mail, iconUrl: email, color: "white", category: "action" },
  { type: "github", label: "GitHub", icon: Github, iconUrl: github, color: "white", category: "trigger" },
  { type: "web3Wallet", label: "Web3 Wallet", icon: TrendingUp, iconUrl: wallet, color: "white", category: "action"},
  { type: "web3Token", label: "Token Price", icon: Coins , iconUrl: token, color: "white", category: "action" },
  // { type: "rss", label: "RSS Feed", icon: Coins , iconUrl: etherium, color: "white", category: "trigger" },
  { type: "discord",label: "Discord",icon: MessageSquare,iconUrl: discord,color: "white",category: "action"},
  // { type: "notion",label: "Notion",icon: FileText,iconUrl: notion,color: "white",category: "action"},
  { type: "telegram",label: "Telegram",icon: Send,iconUrl: telegram,color: "white",category: "action",},
  // { type: "webhook", label: "Post to Webhook", icon: Webhook, color: "white", category: "action" },
  // { type: "twitter",label: "Twitter",icon: X,iconUrl: twitter,color: "white",category: "action",},
  { type: "ai",label: "AI",icon: BrainCircuit,iconUrl: ai,color: "white",category: "action",},
  // { type: "api",label: "API Call",icon: Mail,iconUrl: gmail,color: "white",category: "action",}
]