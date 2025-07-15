import { Send } from "lucide-react";
import type { InputField } from "../common/types";

export function generateTelegramCommand(
  linkName: string,
  userId: string,
  workflowId: string
): string {
  return `/link ${linkName || "<name>"} ${userId}/${workflowId}`;
}

export function TelegramLinkCommand({
  linkName,
  onLinkNameChange,
  userId,
  workflowId,
}: {
  linkName: string;
  onLinkNameChange: (value: string) => void;
  userId: string;
  workflowId: string;
}) {

    const generatedCommand = generateTelegramCommand(linkName, userId, workflowId);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[#c5c5d2]">Link Name</label>
      <p className="text-xs text-[#9b9bab]">
        Create a unique name to link this workflow to your Telegram bot.
      </p>
      <input
        type="text"
        value={linkName}
        onChange={(e) => onLinkNameChange(e.target.value)}
        placeholder="Enter link name (e.g., new_lead_form)"
        className="w-full px-3 py-2 bg-[#2a2e3f] border border-[#3a3f52] rounded-md text-white focus:outline-none focus:border-[#6d3be4]"
      />
      <label className="text-sm font-medium text-[#c5c5d2]">Generated Command</label>
      <p className="text-xs text-[#9b9bab]">
        Send this command to your bot in Telegram to connect it.
      </p>
      <div className="w-full px-3 py-2 bg-[#1e1e2d] border border-[#3a3f52] rounded-md text-white text-sm font-mono overflow-auto">
        {generatedCommand}
      </div>
    </div>
  );
}

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
