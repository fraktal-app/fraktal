import React from "react";
import { DiscordBotLink } from "../../discord/actionConfig";

interface AllAvailableProps {
}

type SaveDataHandler = (data: {

}) => Record<string, any>;

interface OutputLinkConfig {
  Component: React.FC<any>;
  getSaveData: SaveDataHandler;
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
