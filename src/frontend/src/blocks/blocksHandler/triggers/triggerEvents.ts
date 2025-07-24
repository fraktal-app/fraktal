import type { InputField } from "../../common/types";
import { discordExportEvents, discordInputFields, discordTriggerEvents,  } from "../../discord/triggerConfig";
import { githubExportEvents, githubInputFields, githubTriggerEvents } from "../../github/triggerConfig";
import { telegramExportEvents, telegramInputFields, telegramTriggerEvents, } from "../../telegram/triggerConfig";

export const triggerEventsByApp: Record<string, Array<{ value: string; label: string; icon: any }>> = {
  telegram: telegramTriggerEvents,
  discord: discordTriggerEvents,
  github: githubTriggerEvents,
};

export const exportEventsByApp: Record<string, Array<{ value: string; label: string; icon: any }>> = {
  ...telegramExportEvents,
  ...discordExportEvents,
  ...githubExportEvents,
};

export const inputFieldsByApp: Record<string, InputField[]> = {
  telegram: telegramInputFields.telegram,
  discord: discordInputFields.discord,
  github: githubInputFields.github,
};