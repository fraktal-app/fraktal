import { Send } from "lucide-react";
import type { InputField } from "../common/types";

// Telegram credentials input
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
};

// Telegram trigger events with `requiresLinkName` flag
export const telegramTriggerEvents = [
  {
    value: "new-message-telegram",
    label: "New Message Received",
    icon: Send,
    requiresLinkName: true, // This enables the command input box in TriggerDropdown
  },
  // {
  //   value: "bot-command-telegram",
  //   label: "Bot Command Received",
  //   icon: Send,
  //   requiresLinkName: true,
  // },
];

// Export event options based on selected trigger
export const telegramExportEvents = {
  "new-message-telegram": [
    { value: "messenger-detail", label: "Messenger Detail", icon: Send },
  ],
  "bot-command-telegram": [
    { value: "messenger-detail", label: "Messenger Detail", icon: Send },
    { value: "command", label: "Command", icon: Send },
    { value: "everything", label: "Everything", icon: Send },
  ],
};
