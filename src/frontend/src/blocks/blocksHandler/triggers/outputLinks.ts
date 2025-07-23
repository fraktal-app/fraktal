// src/components/triggers/outputLinks.ts
import React from "react";
import { TelegramLinkCommand } from "../../telegram/triggerConfig";
import discordLinkCommand from "../../discord/triggerConfig";
import GithubOutputLink from "../../github/triggerConfig";

interface AllAvailableProps {
  botToken: string;
  onBotTokenChange: React.Dispatch<React.SetStateAction<string>>;
  userId: string;
  workflowId: string;
  guildId: string;
  channelId: string;
  onGuildChange: React.Dispatch<React.SetStateAction<string>>;
  onChannelChange: React.Dispatch<React.SetStateAction<string>>;
}

type SaveDataHandler = (data: {
  botToken?: string;
  userId?: string;
  workflowId?: string;
  guildId?: string;
  channelId?: string;
}) => Record<string, any>;

interface OutputLinkConfig {
  Component: React.FC<any>;
  getSaveData: SaveDataHandler;
  propBuilder: (props: AllAvailableProps) => Record<string, any>;
}

export const outputLinkConfigByApp: Record<string, OutputLinkConfig> = {
  telegram: {
    Component: TelegramLinkCommand,
    getSaveData: ({ botToken }) => ({
      botToken: botToken,
    }),
    propBuilder: (props) => ({
      botToken: props.botToken,
      onBotTokenChange: props.onBotTokenChange,
      userId: props.userId,
      workflowId: props.workflowId,
    }),
  },
  discord: {
     Component: discordLinkCommand,
    getSaveData: ({guildId, channelId}) => ({
      guildId: guildId,
      channelId: channelId,
    }),
    propBuilder: (props) => ({
      onGuildChange: props.onGuildChange,
      onChannelChange: props.onChannelChange,
      userId: props.userId,
      workflowId: props.workflowId,
      guildId: props.guildId,
      channelId: props.channelId,
    }),
  },
  github: {
    Component: GithubOutputLink,
    getSaveData: () => ({}), // No extra data to save for GitHub
    propBuilder: (props) => ({
      userId: props.userId,
      workflowId: props.workflowId,
    }),
  },
};