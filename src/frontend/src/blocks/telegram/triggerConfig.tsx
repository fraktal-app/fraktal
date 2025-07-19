import { Send, SquareArrowOutUpRight, } from "lucide-react";
import type { InputField } from "../common/types";

export function generateTelegramWebhookLink(
  botToken: string,
  userId: string,
  workflowId: string,

): string {
  //TODO change this to exec engine url
  //TODO Remove webhookURL from workflow JSON
  const publicUrl = "https://8f1b6315c65f.ngrok-free.app";

  return `https://api.telegram.org/bot${botToken}/setWebhook?url=${publicUrl}/webhook/telegram/${userId}/${workflowId}/`; 
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

  const handleClick = () => {
    window.open(webhookUrl, '_blank');
  };


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
            <div className="relative w-full mt-2">
              <div className="w-full pr-12 pl-3 py-2 bg-[#2a2e3f] border border-[#3a3f52] rounded-md text-white text-sm font-mono overflow-x-auto">
                {webhookUrl}
              </div>
              <button
                onClick={handleClick}
                className="absolute inset-y-0 right-0 flex items-center justify-center w-10 h-full text-[#9b9bab] hover:text-white transition-colors duration-200"
                aria-label="Copy command"
                
              >
                <SquareArrowOutUpRight />
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
