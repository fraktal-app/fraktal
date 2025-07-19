import React from "react";
import { TelegramLinkCommand } from "../../telegram/triggerConfig";

interface AllAvailableProps {
  botToken: string;
  onBotTokenChange: React.Dispatch<React.SetStateAction<string>>;
  userId: string;
  workflowId: string;
}

type SaveDataHandler = (data: {
  botToken: string;
  userId: string;
  workflowId: string;
}) => Record<string, any>;

interface OutputLinkConfig {
  // Use React.FC<any> to allow for flexible props
  Component: React.FC<any>;
  getSaveData: SaveDataHandler;
  // A function to build the specific props required by the Component
  propBuilder: (props: AllAvailableProps) => Record<string, any>;
}

export const outputLinkConfigByApp: Record<string, OutputLinkConfig> = {
  telegram: {
    Component: TelegramLinkCommand,
    getSaveData: ({ botToken }) => ({
      botToken: botToken,
    }),
    // The propBuilder for Telegram provides all the props its component needs.
    propBuilder: (props) => ({
      botToken: props.botToken,
      onBotTokenChange: props.onBotTokenChange,
      userId: props.userId,
      workflowId: props.workflowId,
    }),
  },
  // Example for a future app that DOES NOT need user/workflow IDs:
  // discord: {
  //   Component: DiscordComponent,
  //   getSaveData: ({ linkName }) => ({ webhookName: linkName }),
  //   // The propBuilder for Discord only provides the props it needs.
  //   propBuilder: (props) => ({
  //     linkName: props.linkName,
  //     onLinkNameChange: props.onLinkNameChange,
  //   }),
  // },
};
