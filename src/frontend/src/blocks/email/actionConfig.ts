import type { InputField } from "../common/types";

export const emailActionInputFields: Record<string, InputField[]> = {
  email: [
    {
      key: "to",
      label: "To Address",
      placeholder: "Enter recipient email address",
      type: "text",
      required: true,
    },
    {
      key: "subject",
      label: "Subject",
      placeholder: "Enter email subject",
      type: "text",
      required: true,
    },
    {
      key: "html",
      label: "HTML Body",
      placeholder: "Enter HTML email content (max 1000 chars)",
      type: "textarea",
      required: true,
      maxLength: 1000,
    },
  ]
};

export const emailResponseDropdownOptions = [
  { value: "send_email", label: "Send Email" }
];

export const emailExportEvents = {
  
};
