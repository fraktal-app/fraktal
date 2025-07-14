import type { InputField } from "../common/types";

export const webhookActionInputFields: Record<string, InputField[]> = {
  webhook: [
  {
    key: "webhookUrl",
    label: "Webhook URL",
    placeholder: "Enter the destination webhook URL",
    type: "text",
    required: true,
  },
  {
    key: "payload",
    label: "Payload",
    placeholder: "Enter the JSON payload to send",
    type: "text",
    required: true,
  }
]
}

export const webhookResponseDropdownOptions= 
   [
  { value: "send_custom_payload", label: "Send custom payload" },
  { value: "trigger_external_service", label: "Trigger external service" },
  { value: "forward_data", label: "Forward data" },
   ];

export const webhookExportEvents: Record<string, Array<{ value: string; label: string; icon: any }>> = {
 
}

