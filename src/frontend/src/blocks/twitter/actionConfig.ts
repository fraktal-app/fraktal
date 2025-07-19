import type { InputField } from "../common/types";

export const twitterActionInputFields: Record<string, InputField[]> = {
  
    twitter: [
  {
    key: "apiKey",
    label: "API Key",
    placeholder: "Enter your Twitter API Key",
    type: "text",
    required: true,
  },
  {
    key: "apiSecret",
    label: "API Key Secret",
    placeholder: "Enter your Twitter API Key Secret",
    type: "password",
    required: true,
  },
  {
    key: "accessToken",
    label: "Access Token",
    placeholder: "Enter your Twitter Access Token",
    type: "password",
    required: true,
  },
  {
    key: "accessTokenSecret",
    label: "Access Token Secret",
    placeholder: "Enter your Twitter Access Token Secret",
    type: "password",
    required: true,
  },
  {
    key: "bearerToken",
    label: "Bearer Token",
    placeholder: "Enter your Twitter Bearer Token (for API v2)",
    type: "password",
    required: false, 
  }
]
}

export const twitterResponseDropdownOptions = 
    [
//   { value: "send_tweet", label: "Send Tweet" },
//   { value: "reply_to_tweet", label: "Reply to Tweet" },
//   { value: "send_tweet_with_hashtags", label: "Send Tweet with Hashtags" },
 ];


export const twitterExportEvents: Record<string, Array<{ value: string; label: string; icon: any }>> = {
  
}