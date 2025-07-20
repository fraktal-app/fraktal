import { MessageSquare,} from "lucide-react";
import type { InputField } from "../common/types"

export function generatediscordExternalLink(
  guildId?: string,
  channelId?: string,
  userId?: string,
  workflowId?: string,


): string {
  return `https://fraktal-external-server-production.up.railway.app/configure?guild_id=${guildId}&channel_id=${channelId}&workflow_id=${workflowId}&user_id=${userId}`; 
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

  const discordUrl = "https://discord.com/oauth2/authorize?client_id=1395353699592704040&permissions=68736&integration_type=0&scope=bot";
  const extLink = generatediscordExternalLink(guildId, channelId, userId, workflowId);

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
        <label className="block text-sm font-medium text-[#c5c5d2] mt-3">Guild Id</label>
        <p className="text-xs text-[#9b9bab] mt-2">
          Enter your guild Id
        </p>
        <input
          type="text"
          value={guildId}
          onChange={(e) => onGuildChange(e.target.value)}
          placeholder="Enter Guild Id"
          className="w-full px-3 py-2 bg-[#2a2e3f] border border-[#3a3f52] rounded-md text-white focus:outline-none focus:border-[#6d3be4] mt-2"
        />
        <label className="block text-sm font-medium text-[#c5c5d2] mt-3">Channel Id</label>
        <p className="text-xs text-[#9b9bab] mt-2">
          Enter your channel Id
        </p>
        <input
          type="text"
          value={channelId}
          onChange={(e) => onChannelChange(e.target.value)}
          placeholder="Enter Channel Id"
          className="w-full px-3 py-2 bg-[#2a2e3f] border border-[#3a3f52] rounded-md text-white focus:outline-none focus:border-[#6d3be4] mt-2"
        />
       {guildId.length > 0 &&
        channelId.length > 0 &&(
        <>
        <label className="block text-sm font-medium text-[#c5c5d2] mt-4">Discord Webhook</label>
        <p className="text-xs text-[#9b9bab] mt-2">
          Open this Link to Set Webhook
        </p>
        <div className="relative w-full mt-2 flex justify-center">
            <button
              onClick={() => window.open(extLink, '_blank')}
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


export const discordInputFields: Record<string, InputField[]> = {
  
  discord: [


]
}


export const discordTriggerEvents = 
  [
    // { value: "new-message", label: "New Message in Channel", icon: MessageSquare },
    { value: "mention-received", label: "Bot Mentioned", icon: MessageSquare , requiresLinkName: true,
},
  ];


  export const discordExportEvents = {
  //  "new-message": [
  //   { value: "messenger-detail", label: "Messenger Detail", icon: MessageSquare },
  //   { value: "message-content", label: "Message Content", icon: MessageSquare },
  //   { value: "everything", label: "Everything", icon: MessageSquare },
  // ],
  "mention-received": [
    { value: "messenger-detail", label: "Messenger Detail", icon: MessageSquare },
    { value: "command", label: "Command", icon: MessageSquare },
    { value: "everything", label: "Everything", icon: MessageSquare },
  ],
}


export default discordLinkCommand;
