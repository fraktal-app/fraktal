import { MessageSquare, SquareArrowOutUpRight } from "lucide-react";
import type { InputField } from "../common/types";

export const DiscordBotLink = () => {
  const discordUrl = "https://discord.com/oauth2/authorize?client_id=1395353699592704040&permissions=68608&integration_type=0&scope=bot";
  
  const handleDiscordBotLinkClick = () => {
    window.open(discordUrl, '_blank');
  };
  

  return (
    <div>
      <div className="flex flex-col">
      <label className="block text-sm font-medium text-[#c5c5d2]">Discord Bot Link</label>
        <p className="text-xs text-[#9b9bab] mt-2">
          Open this Link to Deploy Fraktal Bot in your Discord Server
        </p>
        <div className="relative w-full mt-2">
          <div className="w-full pr-12 pl-3 py-2 bg-[#2a2e3f] border border-[#3a3f52] rounded-md text-white text-sm font-mono overflow-x-auto">
            {discordUrl}
          </div>
          <button
            onClick={handleDiscordBotLinkClick}
            className="absolute inset-y-0 right-0 flex items-center justify-center w-10 h-full text-[#9b9bab] hover:text-white transition-colors duration-200"
            aria-label="Open Discord Bot Link"
          >
            <SquareArrowOutUpRight />
          </button>
        </div>
      </div>
    </div>
    
  );
}


export const discordActionInputFields: Record<string, InputField[]> = {
 
    discord: [
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
  { value: "send_message", label: "Send message",  icon: MessageSquare ,requiresLinkName: true },
  // { value: "send_alert", label: "Send alert" },
  // { value: "send_notification", label: "Send notification" },
  ];


export const discordExportEvents = {
  "send_message": [
    { value: "messageId", label: "Message ID", icon: MessageSquare },
    { value: "channel", label: "Channel Sent", icon: MessageSquare },
  ],
}