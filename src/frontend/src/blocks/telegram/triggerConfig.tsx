import { useState, useEffect } from "react";
import { Send, Loader2, Check, X } from "lucide-react";
import type { InputField } from "../common/types";


export function generateTelegramWebhookLink(
  botToken?: string,
  userId?: string,
  workflowId?: string,
): string {
  // TODO: Change this to the actual execution engine URL from environment variables.
  const executionEngineURL = import.meta.env.VITE_EXECUTION_ENGINE_URL || "https://example.com"; // Fallback for local dev

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
  const [requestStatus, setRequestStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  
  const webhookUrl = generateTelegramWebhookLink(botToken, userId, workflowId);

  useEffect(() => {
    setRequestStatus('idle');
  }, [botToken]);


  const handleSetWebhook = async () => {
    if (!botToken) return;
    setRequestStatus('loading');
    try {
      const response = await fetch(webhookUrl);
      
      if (response.ok) {
        setRequestStatus('success');
        setTimeout(() => setRequestStatus('idle'), 3000);
      } else {
        setRequestStatus('error');
        setTimeout(() => setRequestStatus('idle'), 5000);
      }
    } catch (error) {
      console.error("Webhook setup failed:", error);
      setRequestStatus('error');
      setTimeout(() => setRequestStatus('idle'), 5000);
    }
  };
  
  const getButtonClass = () => {
    const baseClasses = "w-full px-4 py-2 border rounded-lg font-medium transition-colors flex items-center justify-center relative";

    switch (requestStatus) {
      case 'loading':
        return `${baseClasses} border-gray-500 text-gray-400 cursor-not-allowed`;
      case 'success':
        return `${baseClasses} bg-green-500 border-green-500 text-white`;
      case 'error':
        return `${baseClasses} bg-red-500 border-red-500 text-white`;
      case 'idle':
      default:
        return `${baseClasses} border-gray-400 text-white hover:bg-white hover:text-black`;
    }
  };

  return (
    <div>
      <div className="flex flex-col">
        <label className="block text-sm font-medium text-[#c5c5d2]">Bot Token</label>
        <p className="text-xs text-[#9b9bab] mt-2">
          Enter your Telegram Bot Token to generate the webhook link.
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
            <label className="block text-sm font-medium text-[#c5c5d2] mt-4">Set Webhook</label>
            <p className="text-xs text-[#9b9bab] mt-2">
              Click the button to activate the webhook for your bot.
            </p>
            <div className="relative w-full mt-2 flex items-center">
              <button
                onClick={handleSetWebhook}
                disabled={requestStatus === 'loading'}
                className={getButtonClass()}
              >
                <span>Set Webhook</span>

                <div className="absolute right-4">
                  {requestStatus === 'loading' && <Loader2 size={20} className="animate-spin" />}
                  {requestStatus === 'success' && <Check size={20} />}
                  {requestStatus === 'error' && <X size={20} />}
                </div>
              </button>
              {requestStatus === 'error' && (
                <div className="absolute left-full ml-3 px-3 py-1.5 bg-red-700 text-white text-xs font-semibold rounded-md shadow-lg whitespace-nowrap z-10">
                  Re-check your inputs
                  <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-700 transform rotate-45"></div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export const telegramInputFields: Record<string, InputField[]> = {
  telegram: []
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
    { value: "everything", "label": "Everything", icon: Send },
  ],
};

export default TelegramLinkCommand;
