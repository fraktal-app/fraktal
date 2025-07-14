import type { InputField } from "../common/types";

export const aiActionInputFields: Record<string, InputField[]> = {
  
    AI: [
  {
    key: "apiKey",
    label: "AI API Key",
    placeholder: "Enter your AI service API key (e.g., OpenAI)",
    type: "password",
    required: true,
  },
  {
    key: "prompt",
    label: "Prompt",
    placeholder: "Enter your input prompt for the AI model",
    type: "text",
    required: true,
  }
]
}

export const aiResponseDropdownOptions = 
    [
  { value: "generate_text", label: "Generate text" },
  { value: "summarize_input", label: "Summarize input" },
  { value: "extract_information", label: "Extract information" },
];


export const aiExportEvents: Record<string, Array<{ value: string; label: string; icon: any }>> = {
  
}