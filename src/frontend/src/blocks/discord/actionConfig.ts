import { MessageSquare } from "lucide-react";
import type { InputField } from "../common/types";

export const discordActionInputFields: Record<string, InputField[]> = {
 
    discord: [
  {
    key: "botToken",
    label: "Bot Token",
    placeholder: "Enter your Discord Bot Token",
    type: "password",
    required: true,
  },
  {
    key: "applicationId",
    label: "Application ID",
    placeholder: "Enter your Discord Application ID",
    type: "text",
    required: false,
  },
  {
    key: "guildId",
    label: "Guild ID",
    placeholder: "Enter your Discord Server (Guild) ID",
    type: "text",
    required: true,
  },
  {
    key: "channelId",
    label: "Channel ID",
    placeholder: "Enter the Channel ID to send the message to",
    type: "text",
    required: true,
  }
]
}

export const discordResponseDropdownOptions= 
  [
  { value: "send_message", label: "Send message" },
  { value: "send_alert", label: "Send alert" },
  { value: "send_notification", label: "Send notification" },
  ];


export const discordExportEvents = {
  "send_message": [
    { value: "messageId", label: "Message ID", icon: MessageSquare },
    { value: "channel", label: "Channel Sent", icon: MessageSquare },
  ],
}