import type { InputField } from "../../common/types";
import { discordExportEvents, discordInputFields, discordTriggerEvents,  } from "../../discord/triggerConfig";
import { githubExportEvents, githubInputFields, githubTriggerEvents } from "../../github/triggerConfig";
import { rssExportEvents, rssInputFields, rssTriggerEvents } from "../../rss/triggerConfig";
import { telegramExportEvents, telegramInputFields, telegramTriggerEvents, } from "../../telegram/triggerConfig";
import { walletExportEvents, walletInputFields, walletTriggerEvents } from "../../web3 wallet/triggerConfig";

export const triggerEventsByApp: Record<string, Array<{ value: string; label: string; icon: any }>> = {
  telegram: telegramTriggerEvents,
  discord: discordTriggerEvents,
  github: githubTriggerEvents,
  wallet: walletTriggerEvents,
  rss: rssTriggerEvents,
};

export const exportEventsByApp: Record<string, Array<{ value: string; label: string; icon: any }>> = {
  ...telegramExportEvents,
  ...discordExportEvents,
  ...githubExportEvents,
  ...walletExportEvents,
  ...rssExportEvents,
};

export const inputFieldsByApp: Record<string, InputField[]> = {
  telegram: telegramInputFields.telegram,
  discord: discordInputFields.discord,
  github: githubInputFields.github,
  wallet: walletInputFields.wallet,
  rss: rssInputFields.rss,
};