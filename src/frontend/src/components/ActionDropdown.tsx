// Enhanced ActionDropdown component
import { useState, useRef, useEffect } from "react"
import {
  Mail,
  ChevronDown,
  MessageSquare,
  Send,
  Github,
  TrendingUp,
  Coins,
} from "lucide-react"

const inputFieldsByApp: Record<
  string,
  Array<{
    key: string
    label: string
    placeholder: string
    type: "text" | "password"
    required?: boolean
  }>
> = {
  "gmail-send": [
    { key: "clientId", label: "Client ID", placeholder: "Enter Client ID", type: "text", required: true },
    { key: "clientSecret", label: "Client Secret", placeholder: "Enter Client Secret", type: "password", required: true },
  ],
  "discord-send": [
    { key: "botToken", label: "Bot Token", placeholder: "Enter Discord Bot Token", type: "password", required: true },
  ],
  "telegram-send": [
    { key: "botToken", label: "Bot Token", placeholder: "Enter your Telegram Bot Token", type: "password", required: true },
    { key: "chatId", label: "Chat ID", placeholder: "Enter Chat ID to send message to", type: "text", required: true },
  ],
  "notion-create": [
    { key: "apiKey", label: "API Key", placeholder: "Enter your Notion API Key", type: "password", required: true },
    { key: "databaseId", label: "Database ID", placeholder: "Enter Database ID", type: "text", required: true },
    { key: "title", label: "Page Title", placeholder: "Enter page title", type: "text", required: true },
    { key: "content", label: "Page Content", placeholder: "Enter page content", type: "text", required: true }
  ],
  "webhook-post": [
    { key: "webhookUrl", label: "Webhook URL", placeholder: "Enter webhook URL", type: "text", required: true },
    { key: "payload", label: "Payload", placeholder: "Enter JSON payload", type: "text", required: true }
  ]
}

// Add action options for each app
const actionDropdownOptions: Record<string, string[]> = {
  "gmail-send": ["Send Gmail notification", "Send custom email", "Send alert email"],
  "discord-send": ["Send message", "Send alert", "Send notification"],
  "telegram-send": ["Send message", "Send alert", "Pin message"],
  "notion-create": ["Create page", "Log to database", "Create task"],
  "webhook-post": ["Send custom payload", "Trigger external service", "Forward data"]
}

export default function ActionDropdown({
  isOpen,
  onSave,
  onCancel,
  appType,
}: {
  isOpen: boolean
  onSave: (formData: { [key: string]: string }) => void
  onCancel: () => void
  appType?: string
}) {
  const [credentials, setCredentials] = useState<Record<string, string>>({})
  const [selectedAction, setSelectedAction] = useState<string>("")

  // Use the full appType (e.g., "gmail-send", "discord-send") instead of splitting
  const credentialFields = appType ? inputFieldsByApp[appType] || [] : []
  const actionOptions = appType ? actionDropdownOptions[appType] || [] : []

  const isFormValid =
    selectedAction && // Action must be selected
    (credentialFields.length === 0 ||
    credentialFields.every((field) => !field.required || credentials[field.key]?.trim()))

  const handleCredentialChange = (key: string, value: string) => {
    setCredentials((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    if (isFormValid) {
      onSave({ 
        ...credentials, 
        event: selectedAction,
        export: selectedAction
      })
    }
  }

  const handleCancel = () => {
    setCredentials({})
    setSelectedAction("")
    onCancel()
  }

  if (!isOpen) return null

  return (
    <div className="mt-3 p-4 bg-[#1b1f2a] border border-[#3a3f52] rounded-lg space-y-4">
      <div>
        <h3 className="text-sm font-medium text-white mb-2">Configure Action</h3>
        <p className="text-xs text-[#9b9bab] mb-3">Select an action and enter required credentials</p>
      </div>

      <div className="space-y-3">
        {/* Action Selection */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[#c5c5d2]">Select Action</label>
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="w-full px-3 py-2 bg-[#2a2e3f] border border-[#3a3f52] rounded-md text-white focus:outline-none focus:border-[#6d3be4]"
          >
            <option value="" disabled>
              Choose an action
            </option>
            {actionOptions.map((action) => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </select>
        </div>

        {/* Credential Fields */}
        {credentialFields.map((field) => (
          <div className="flex flex-col gap-2" key={field.key}>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-[#c5c5d2]">{field.label}</label>
              {field.required && (
                <span className="bg-red-500/20 text-red-400 text-xs px-1.5 py-0.5 rounded-full">*</span>
              )}
            </div>
            <input
              type={field.type}
              value={credentials[field.key] || ""}
              onChange={(e) => handleCredentialChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              className="w-full px-3 py-2 bg-[#2a2e3f] border border-[#3a3f52] rounded-md text-white focus:outline-none focus:border-[#6d3be4]"
            />
          </div>
        ))}
      </div>

      <div className="flex justify-between gap-2 pt-2">
        <button
          onClick={handleCancel}
          className="px-3 py-1 text-sm font-medium text-[#9b9bab] bg-[#2a2e3f] border border-[#3a3f52] rounded-md hover:bg-[#3a3f52]"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!isFormValid}
          className="px-3 py-1 text-sm font-medium text-white bg-[#6d3be4] border border-transparent rounded-md hover:bg-[#5a2fc7] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Configuration
        </button>
      </div>
    </div>
  )
}