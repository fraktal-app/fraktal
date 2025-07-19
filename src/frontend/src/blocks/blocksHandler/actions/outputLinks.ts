import React from "react";
import { DiscordBotLink } from "../../discord/actionConfig";

interface AllAvailableProps {
}

type SaveDataHandler = (data: {

}) => Record<string, any>;

interface OutputLinkConfig {
  // Use React.FC<any> to allow for flexible props
  Component: React.FC<any>;
  getSaveData: SaveDataHandler;
  // A function to build the specific props required by the Component
  propBuilder: (props: AllAvailableProps) => Record<string, any>;
}

export const outputLinkConfigByApp: Record<string, OutputLinkConfig> = {
 
    discord: {
        Component: DiscordBotLink,
         getSaveData: () => ({

    }),
    propBuilder: () => ({

    }),
    },
};
