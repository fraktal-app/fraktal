import { Send, } from "lucide-react";
import type { InputField } from "../common/types";

export function generateTelegramWebhookLink(
  botToken?: string,
  userId?: string,
  workflowId?: string,

): string {
  //TODO change this to exec engine url
  //TODO Remove webhookURL from workflow JSON
  const executionEngineURL = import.meta.env.VITE_EXECUTION_ENGINE_URL ;

  return `https://api.telegram.org/bot${botToken}/setWebhook?url=${executionEngineURL}/webhook/telegram/${userId}/${workflowId}/`; 
}

export function TelegramLinkCommand({
  botToken,
  onBotTokenChange,
  userId,
  workflowId,
}: {
  botToken: string;
  onBotTokenChange: (value: string) => void;
  userId: string;
  workflowId: string;
}) {

  const webhookUrl = generateTelegramWebhookLink(botToken, userId,  workflowId,);



  return (
    <div>
      <div className="flex flex-col">
        <label className="block text-sm font-medium text-[#c5c5d2]">Bot Token</label>
        <p className="text-xs text-[#9b9bab] mt-2">
          Enter your Telegram Bot Token
        </p>
        <input
          type="text"
          value={botToken}
          onChange={(e) => onBotTokenChange(e.target.value)}
          placeholder="Enter Bot Token"
          className="w-full px-3 py-2 bg-[#2a2e3f] border border-[#3a3f52] rounded-md text-white focus:outline-none focus:border-[#6d3be4] mt-2"
        />
        {botToken.length > 0 && (
          <>
            <label className="block text-sm font-medium text-[#c5c5d2] mt-4">Generated Link</label>
            <p className="text-xs text-[#9b9bab] mt-2">
              Open this Link to Set Webhook 
            </p>
            <div className="relative w-full mt-2 flex justify-center">
            <button
              onClick={() => window.open(webhookUrl, '_blank')}
              className="w-full px-4 py-2 border border-gray-400 text-white hover:bg-white hover:text-black rounded-lg font-medium transition-colors"
            >
              Open Webhook Link
            </button>
          </div>
          </>          
        )}

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
  {
    value: "command-received-telegram",
    label: "Command Received",
    icon: Send,
    requiresLinkName: true,
  }
];

export const telegramExportEvents = {
  "new-message-telegram": [
    { value: "messenger-detail", label: "Messenger Detail", icon: Send },
    { value: "message", label: "Message Detail", icon: Send },
    { value: "everything", label: "Everything", icon: Send },
  ],
  "command-received-telegram": [
    { value: "messenger-detail", label: "Messenger Detail", icon: Send },
    { value: "command", label: "Command", icon: Send },
    { value: "everything", label: "Everything", icon: Send },
  ],
};

export default TelegramLinkCommand;
