import { Send } from "lucide-react";
import type { InputField } from "../common/types"

export const telegramInputFields: Record<string, InputField[]> = {
  
  telegram: [
  {
    key: "botToken",
    label: "Bot Token",
    placeholder: "Enter your Telegram Bot Token",
    type: "password",
    required: true,
  }
]
}

export const telegramTriggerEvents = 
  [
    { value: "new-message-telegram", label: "New Message Received", icon: Send },
    { value: "bot-command-telegram", label: "Bot Command Received", icon: Send },
  ];


export const telegramExportEvents = {
   "new-message-telegram": [
    { value: "messenger-detail", label: "Messenger Detail", icon: Send },
    { value: "message-content", label: "Message Content", icon: Send },
    { value: "everything", label: "Everything", icon: Send },
  ],
  "bot-command-telegram": [
    { value: "messenger-detail", label: "Messenger Detail", icon: Send },
    { value: "command", label: "Command", icon: Send },
    { value: "everything", label: "Everything", icon: Send },
  ],
}