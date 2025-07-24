import type { InputField } from "../../common/types";
import { aiActionInputFields, aiCustomPrompt, aiExportEvents, aiResponseDropdownOptions } from "../../ai/actionConfig";
import { discordActionInputFields, discordCustomMessage, discordExportEvents, discordResponseDropdownOptions } from "../../discord/actionConfig";
import { telegramActionInputFields, telegramCustomMessage, telegramExportEvents, telegramResponseDropdownOptions } from "../../telegram/actionConfig";
import { emailActionInputFields, emailExportEvents, emailResponseDropdownOptions } from "../../email/actionConfig";
import { web3TokenActionInputFields, web3TokenExportEvents, web3TokenResponseDropdownOptions } from "../../web3 token/actionConfig";
import { web3WalletActionInputFields, web3WalletExportEvents, web3WalletResponseDropdownOptions } from "../../web3 wallet/actionConfig";

export const actionDropdownOptions: Record<string, Array<{ value: string; label: string; icon: any  }>>   = {
  telegram: telegramResponseDropdownOptions,
  discord: discordResponseDropdownOptions,
  ai: aiResponseDropdownOptions,
  email: emailResponseDropdownOptions,
  web3Token: web3TokenResponseDropdownOptions,
  web3Wallet: web3WalletResponseDropdownOptions
};

export const actionInputFieldsByApp: Record<string, InputField[]> = {
  telegram: telegramActionInputFields.telegram,
  discord: discordActionInputFields.discord,
  ai: aiActionInputFields.ai,
  email: emailActionInputFields.email,
  web3Token: web3TokenActionInputFields.web3Token,
  web3Wallet: web3WalletActionInputFields.web3Wallet
};

export const customMessageFieldsByAction: Record<string, InputField[]> = {
   ...discordCustomMessage,
   ...telegramCustomMessage,
   ...aiCustomPrompt

}
export const exportEventsByAction: Record<string, Array<{ value: string; label: string; icon: any }>>= {
  ...telegramExportEvents,
  ...discordExportEvents,
  ...aiExportEvents,
  ...emailExportEvents,
  ...web3TokenExportEvents,
  ...web3WalletExportEvents
};
