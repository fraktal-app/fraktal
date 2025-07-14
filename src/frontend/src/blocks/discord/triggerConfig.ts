import { MessageSquare } from "lucide-react";
import type { InputField } from "../common/types"

export const discordInputFields: Record<string, InputField[]> = {
  
  discord: [
  {
    key: "botToken",
    label: "Bot Token",
    placeholder: "Enter your Discord Bot Token",
    type: "password",
    required: true,
  }
]
}

export const discordTriggerEvents = 
  [
    { value: "new-message", label: "New Message in Channel", icon: MessageSquare },
    { value: "mention-received", label: "Bot Mentioned", icon: MessageSquare },
  ];

  export const discordExportEvents = {
   "new-message": [
    { value: "messenger-detail", label: "Messenger Detail", icon: MessageSquare },
    { value: "message-content", label: "Message Content", icon: MessageSquare },
    { value: "everything", label: "Everything", icon: MessageSquare },
  ],
  "mention-received": [
    { value: "messenger-detail", label: "Messenger Detail", icon: MessageSquare },
    { value: "command", label: "Command", icon: MessageSquare },
    { value: "everything", label: "Everything", icon: MessageSquare },
  ],
}