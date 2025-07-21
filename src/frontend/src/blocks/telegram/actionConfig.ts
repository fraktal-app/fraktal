import { MessageSquare } from "lucide-react";
import type { InputField } from "../common/types";

export const telegramResponseDropdownOptions = 
   [  
  { value: "send_telegram_message", label: "Send message", icon: MessageSquare },
  //{ value: "send_alert", label: "Send alert" },
  //{ value: "pin_message", label: "Pin message" },
];


export const telegramActionInputFields: Record<string, InputField[]> = {
  
    telegram: [
        {
            key: "telegram_botToken",
            label: "Bot Token",
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
                pill: '{step_1.chat.id}',
                pillLabel: 'Reply to trigger chat id'
            }
        },
    ]
};
export const telegramCustomMessage: Record<string, InputField[]> = {
  "send_telegram_message": [
    {
      key: "Message",
      label: "Message",
      placeholder: "Enter your message here...",
      type: "textarea",
      required: true,
      allowDataMapping: true,
      description: "This message will be sent to the specified Telegram Chat."
    }
  ],
}

export const telegramExportEvents = {
  "send_telegram_message": [
    { value: "chatID", label: "Chat ID", icon: MessageSquare },
    { value: "channel", label: "Channel Sent", icon: MessageSquare },
  ],
}