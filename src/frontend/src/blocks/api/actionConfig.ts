import type { InputField } from "../common/types";

export const apiActionInputFields: Record<string, InputField[]> = {
  
    API: [
  {
    key: "url",
    label: "API URL",
    placeholder: "Enter the API endpoint URL",
    type: "text",
    required: true,
  },
  {
    key: "headers",
    label: "Headers",
    placeholder: "Enter request headers in JSON format (optional)",
    type: "text",
    required: false,
  },
  {
    key: "body",
    label: "Body",
    placeholder: "Enter request body for POST/PUT (optional)",
    type: "text",
    required: false,
  }
]
}

export const apiResponseDropdownOptions = 
     [
  // { value: "call_external_api", label: "Call external API" },
  // { value: "send_data", label: "Send data to endpoint" },
  // { value: "trigger_webhook", label: "Trigger webhook" },
];



export const apiExportEvents: Record<string, Array<{ value: string; label: string; icon: any }>> = {
  
}