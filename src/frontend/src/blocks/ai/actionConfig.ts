import { BrainCircuit,  } from "lucide-react";
import type { InputField } from "../common/types";

export const aiResponseDropdownOptions = [
  { value: "generate_text", label: "Generate text", icon: BrainCircuit},
];

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

export const aiCustomPrompt: Record<string, InputField[]> = {
  "generate_text": [
    {
      key: "prompt",
      label: "Propmt",
      placeholder: "Enter your prompt here...",
      type: "textarea",
      required: true,
      allowDataMapping: true,
      description: "This prompt will be used to extract information from the input.."
    }
  ],
  "summarize_input": [
    {
      key: "prompt",
      label: "Prompt",
      placeholder: "Enter your prompt here...",
      type: "textarea",
      required: true,
      allowDataMapping: true,
      description: "This prompt will be used to extract information from the input."
    }
  ],
  "extract_information": [
    {
      key: "prompt",
      label: "Prompt",
      placeholder: "Enter your prompt here...",
      type: "textarea",
      required: true,
      allowDataMapping: true,
      description: "This prompt will be used to extract information from the input."
    }
  ],
}

export const aiExportEvents= {
  "generate_text": [
    { value: "response", label: "Response", icon: BrainCircuit },
  ],
  "summarize_input": [
    { value: "response", label: "Response", icon: BrainCircuit },
  ],
  "extract_information": [
    { value: "response", label: "Response", icon: BrainCircuit },
  ],
}