import { useState, useEffect } from "react";
import { MessageSquare, Loader2, Check, X } from "lucide-react";
import type { InputField } from "../common/types"

const DISCORD_SERVER_URL = import.meta.env.VITE_DISCORD_SERVER_URL;

export function generatediscordExternalLink(
  guildId?: string,
  channelId?: string,
  userId?: string,
  workflowId?: string,
): string {
  return `${DISCORD_SERVER_URL}/configure?guild_id=${guildId}&channel_id=${channelId}&workflow_id=${workflowId}&user_id=${userId}`; 
}

export function discordLinkCommand({
  onGuildChange,
  onChannelChange,
  guildId,
  channelId,
  userId,
  workflowId,
}: {
  onGuildChange: (value: string) => void;
  onChannelChange: (value: string) => void;
  guildId: string;
  channelId: string;
  userId: string;
  workflowId: string;
}) {
  const [requestStatus, setRequestStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const discordUrl = "https://discord.com/oauth2/authorize?client_id=1395353699592704040&permissions=68736&integration_type=0&scope=bot";
  const extLink = generatediscordExternalLink(guildId, channelId, userId, workflowId);

  useEffect(() => {
    setRequestStatus('idle');
  }, [guildId, channelId]);

  const handleSetWebhook = async () => {
    if (!guildId || !channelId) return;
    setRequestStatus('loading');
    try {
      const response = await fetch(extLink)
      
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
        <label className="block text-sm font-medium text-[#c5c5d2]">Discord Bot Link</label>
        <p className="text-xs text-[#9b9bab] mt-2">
          Open this Link to Deploy Fraktal Bot in your Discord Server
        </p>
        <div className="relative w-full mt-2 flex justify-center">
            <button
              onClick={() => window.open(discordUrl, '_blank')}
              className="w-full px-4 py-2 border border-gray-400 text-white hover:bg-white hover:text-black rounded-lg font-medium transition-colors"
            >
              Deploy Fraktal Bot
            </button>
        </div>
        <label className="block text-sm font-medium text-[#c5c5d2] mt-3">Guild ID</label>
        <p className="text-xs text-[#9b9bab] mt-2">
          Enter your server's Guild ID
        </p>
        <input
          type="text"
          value={guildId}
          onChange={(e) => onGuildChange(e.target.value)}
          placeholder="Enter Guild ID"
          className="w-full px-3 py-2 bg-[#2a2e3f] border border-[#3a3f52] rounded-md text-white focus:outline-none focus:border-[#6d3be4] mt-2"
        />
        <label className="block text-sm font-medium text-[#c5c5d2] mt-3">Channel ID</label>
        <p className="text-xs text-[#9b9bab] mt-2">
          Enter the ID of the channel for notifications
        </p>
        <input
          type="text"
          value={channelId}
          onChange={(e) => onChannelChange(e.target.value)}
          placeholder="Enter Channel ID"
          className="w-full px-3 py-2 bg-[#2a2e3f] border border-[#3a3f52] rounded-md text-white focus:outline-none focus:border-[#6d3be4] mt-2"
        />
       {guildId.length > 0 && channelId.length > 0 && (
          <>
            <label className="block text-sm font-medium text-[#c5c5d2] mt-4">Discord Webhook</label>
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


export const discordInputFields: Record<string, InputField[]> = {
  discord: []
}


export const discordTriggerEvents = [
    { value: "mention-received", label: "Bot Mentioned", icon: MessageSquare , requiresLinkName: true, },
];


export const discordExportEvents = {
  "mention-received": [
    { value: "messenger-detail", label: "Messenger Detail", icon: MessageSquare },
    { value: "command", label: "Command", icon: MessageSquare },
    { value: "everything", label: "Everything", icon: MessageSquare },
  ],
}

export default discordLinkCommand;
