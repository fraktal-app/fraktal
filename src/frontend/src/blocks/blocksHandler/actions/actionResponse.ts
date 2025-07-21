import type { InputField } from "../../common/types";
import { aiActionInputFields, aiExportEvents, aiResponseDropdownOptions } from "../../ai/actionConfig";
import { discordActionInputFields, discordCustomMessage, discordExportEvents, discordResponseDropdownOptions } from "../../discord/actionConfig";
import { notionActionInputFields, notionExportEvents, notionResponseDropdownOptions } from "../../notion/actionConfig";
import { telegramActionInputFields, telegramCustomMessage, telegramExportEvents, telegramResponseDropdownOptions } from "../../telegram/actionConfig";
import { twitterActionInputFields, twitterExportEvents, twitterResponseDropdownOptions } from "../../twitter/actionConfig";
import { webhookActionInputFields, webhookExportEvents, webhookResponseDropdownOptions } from "../../webhook/actionConfig";
import { apiActionInputFields, apiExportEvents, apiResponseDropdownOptions } from "../../api/actionConfig";
import { emailActionInputFields, emailExportEvents, emailResponseDropdownOptions } from "../../email/actionConfig";

export const actionDropdownOptions: Record<string, Array<{ value: string; label: string; icon: any  }>>   = {
  telegram: telegramResponseDropdownOptions,
  discord: discordResponseDropdownOptions,
  notion: notionResponseDropdownOptions,
  webhook: webhookResponseDropdownOptions,
  twitter: twitterResponseDropdownOptions,
  ai: aiResponseDropdownOptions,
  api: apiResponseDropdownOptions,
  email: emailResponseDropdownOptions
};

export const actionInputFieldsByApp: Record<string, InputField[]> = {
  telegram: telegramActionInputFields.telegram,
  discord: discordActionInputFields.discord,
  notion: notionActionInputFields.notion,
  webhook: webhookActionInputFields.webhook,
  twitter: twitterActionInputFields.twitter,
  ai: aiActionInputFields.ai,
  api: apiActionInputFields.api,
  email: emailActionInputFields.email
};

export const customMessageFieldsByAction: Record<string, InputField[]> = {
   ...discordCustomMessage,
   ...telegramCustomMessage

}
export const exportEventsByAction: Record<string, Array<{ value: string; label: string; icon: any }>>= {
  ...telegramExportEvents,
  ...discordExportEvents,
  ...notionExportEvents,
  ...webhookExportEvents,
  ...twitterExportEvents,
  ...aiExportEvents,
  ...apiExportEvents,
  ...emailExportEvents
};
