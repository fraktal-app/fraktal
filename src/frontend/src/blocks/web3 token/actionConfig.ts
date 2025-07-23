import { MessageSquare } from "lucide-react";
import type { InputField } from "../common/types";

export const web3TokenResponseDropdownOptions = 
   [  
  { value: "get_token_price", label: "Get token price", icon: MessageSquare },
  //{ value: "send_alert", label: "Send alert" },
  //{ value: "pin_message", label: "Pin message" },
];


export const web3TokenActionInputFields: Record<string, InputField[]> = {
  
    web3Token: [
        {
            key: "eth",
            label: "",
            placeholder: "Enter your Telegram Bot Token",
            type: "text",
            required: true,
        },
        {
            key: "telegram_chatId",
            label: "Chat ID",
            placeholder: "Enter the Custom Chat ID to send the message to",
            type: "text",
            required: true,
            conditional: {
                basedOn: 'triggerApp',
                appType: 'telegram',
                pill: '$?{trigger-1.telegram/chat_id}',
                pillLabel: 'Reply to Trigger\'s Chat ID'
            }
        },
    ]
};

export const web3TokenExportEvents = {
  "send_telegram_message": [
    { value: "chatID", label: "Chat ID", icon: MessageSquare },
    { value: "channel", label: "Channel Sent", icon: MessageSquare },
  ],
}