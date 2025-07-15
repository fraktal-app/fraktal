import { MessageSquare } from "lucide-react";
import type { InputField } from "../common/types";

export const telegramActionInputFields: Record<string, InputField[]> = {
  
    telegram: [
    {
        key: "botToken",
        label: "Bot Token",
        placeholder: "Enter your Telegram Bot Token",
        type: "password",
        required: true,
    },
    {
        key: "chatId",
        label: "Chat ID",
        placeholder: "Enter the Chat ID to send the message to",
        type: "text",
        required: true,
    }
    ]
}

export const telegramResponseDropdownOptions = 
   [  
  { value: "send_message", label: "Send message" },
  //{ value: "send_alert", label: "Send alert" },
  //{ value: "pin_message", label: "Pin message" },
];


export const telegramExportEvents = {
  "send_message": [
    { value: "messageId", label: "Message ID", icon: MessageSquare },
    { value: "channel", label: "Channel Sent", icon: MessageSquare },
  ],
}