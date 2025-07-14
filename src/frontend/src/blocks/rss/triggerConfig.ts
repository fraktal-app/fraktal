import { Rss, Search } from "lucide-react";
import type { InputField } from "../common/types"

export const rssInputFields: Record<string, InputField[]> = {
  
  RSS: [
  {
    key: "feedUrl",
    label: "RSS Feed URL",
    placeholder: "Enter the full RSS or Atom feed URL",
    type: "text",
    required: true,
  },
  {
    key: "pollInterval",
    label: "Poll Interval (in minutes)",
    placeholder: "Enter poll frequency in minutes (e.g., 15)",
    type: "text",
    required: true,
  }
]
}

export const rssTriggerEvents = 
  [
    {
    value: "new-feed-item",
    label: "New Feed Item Published",
    icon: Rss, 
  },
  {
    value: "feed-updated",
    label: "Feed Metadata Updated",
    icon: Rss,
  },
  {
    value: "item-matches-keyword",
    label: "Feed Item Contains Keyword",
    icon: Search, 
  }
  ];


export const rssExportEvents = {
   
}