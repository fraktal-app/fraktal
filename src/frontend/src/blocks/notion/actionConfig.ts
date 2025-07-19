import { FileText } from "lucide-react";
import type { InputField } from "../common/types";

export const notionActionInputFields: Record<string, InputField[]> = {
  notion: [
  {
    key: "integrationToken",
    label: "integrationToken",
    placeholder: "Enter your Notion integrationToken",
    type: "password",
    required: true,
  },
  {
    key: "databaseId",
    label: "Database ID",
    placeholder: "Enter the Notion Database ID",
    type: "text",
    required: true,
  },
  {
    key: "pageID",
    label: "Page ID",
    placeholder: "Enter the ID for the new page",
    type: "text",
    required: true,
  }
]
}

export const notionResponseDropdownOptions= 
 [
  // { value: "create_page", label: "Create page",icon: FileText  },
  // { value: "log_to_database", label: "Log to database" },
  // { value: "create_task", label: "Create task" },   
];


export const notionExportEvents: Record<string, Array<{ value: string; label: string; icon: any }>> = {
  "create_page": [
    { value: "pageId", label: "Page ID", icon: FileText },
    { value: "createdTime", label: "Creation Time", icon: FileText },
  ],
}