import { Rss, } from "lucide-react";
import type { InputField } from "../common/types"

export const rssInputFields: Record<string, InputField[]> = {
  
  rss: [
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
    value: "feed_updated",
    label: "Feed Metadata Updated",
    icon: Rss,
  },
  ];


export const rssExportEvents = {
   "feed_updated": [
    { value: "new_item", label: "New feed item", icon: Rss },
  ],
}