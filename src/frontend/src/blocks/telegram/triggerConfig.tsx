import { Send, Copy, Check } from "lucide-react";
import { useState } from "react";
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
  const [isCopied, setIsCopied] = useState(false);

  const generatedCommand = generateTelegramCommand(linkName, userId, workflowId);

  const handleCopy = () => {
    const textArea = document.createElement("textarea");
    textArea.value = generatedCommand;

    textArea.style.position = "absolute";
    textArea.style.left = "-9999px";
    
    document.body.appendChild(textArea);
    textArea.select();

    try {
      document.execCommand('copy');
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    } finally {
      document.body.removeChild(textArea);
    }
  };


  return (
    <div>
      <div className="flex flex-col">
        <label className="block text-sm font-medium text-[#c5c5d2]">Trigger Name</label>
        <p className="text-xs text-[#9b9bab] mt-2">
          Create a unique name to link this workflow to your Telegram bot.
        </p>
        <input
          type="text"
          value={linkName}
          onChange={(e) => onLinkNameChange(e.target.value)}
          placeholder="Enter Trigger name (e.g., new_lead_form)"
          className="w-full px-3 py-2 bg-[#2a2e3f] border border-[#3a3f52] rounded-md text-white focus:outline-none focus:border-[#6d3be4] mt-2"
        />
        <label className="block text-sm font-medium text-[#c5c5d2] mt-4">Generated Command</label>
        <p className="text-xs text-[#9b9bab] mt-2">
          Send this command to <a href="https://t.me/fraktalapp_bot" className="text-[#6d3be4] hover:underline" target="_blank" rel="noopener noreferrer">@fraktalapp_bot</a> on Telegram to connect it.
        </p>
        <div className="relative w-full mt-2">
          <div className="w-full pr-12 pl-3 py-2 bg-[#2a2e3f] border border-[#3a3f52] rounded-md text-white text-sm font-mono overflow-x-auto">
            {generatedCommand}
          </div>
          <button
            onClick={handleCopy}
            className="absolute inset-y-0 right-0 flex items-center justify-center w-10 h-full text-[#9b9bab] hover:text-white transition-colors duration-200"
            aria-label="Copy command"
          >
            {isCopied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}

export const telegramInputFields: Record<string, InputField[]> = {
  telegram: [
    
  ]
};

export const telegramTriggerEvents = [
  {
    value: "new-message-telegram",
    label: "New Message Received",
    icon: Send,
    requiresLinkName: true,
  },
];

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

export default TelegramLinkCommand;
