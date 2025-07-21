import { MessageSquare, } from "lucide-react";
import type { InputField } from "../common/types";

export const DiscordBotLink = () => {
  const discordUrl = "https://discord.com/oauth2/authorize?client_id=1395353699592704040&permissions=68736&integration_type=0&scope=bot";
  
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
      </div>
    </div>
    
  );
}

export const discordResponseDropdownOptions= 
  [
  { value: "send_discord_message", label: "Send Message",  icon: MessageSquare ,requiresLinkName: true },
  // { value: "send_notification", label: "Send notification" },
  ];
  
export const discordActionInputFields: Record<string, InputField[]> = {
 
    discord: [
  {
    key: "discord_guildId",
    label: "Guild ID",
    placeholder: "Enter your Discord Server (Guild) ID",
    type: "text",
    required: true,
  },
  {
    key: "discord_channelId",
    label: "Channel ID",
    placeholder: "Enter the Channel ID to send the message to",
    type: "text",
    required: true,
  }
]
}

export const discordCustomMessage: Record<string, InputField[]> = {
  "send_discord_message": [
    {
      key: "discord_message",
      label: "Custom Message",
      placeholder: "Enter your custom message here...",
      type: "textarea",
      required: true,
      allowDataMapping: true,
      description: "This message will be sent to the specified Discord channel."
    }
  ],
}


export const discordExportEvents = {
  "send_discord_message": [
    { value: "timestamp", label: "Timestamp", icon: MessageSquare },
    { value: "message_content", label: "Message Content", icon: MessageSquare },
  ],
}