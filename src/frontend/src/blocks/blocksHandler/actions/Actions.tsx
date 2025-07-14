import { useState } from "react"
import { actionDropdownOptions, actionInputFieldsByApp, exportEventsByAction } from "./actionResponse"

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
  const [selectedExport, setSelectedExport] = useState<string>("")

  // Use the full appType (e.g., "gmail-send", "discord-send") instead of splitting
const credentialFields = appType
  ? actionInputFieldsByApp[appType] || []
  : []

  const actionOptions = appType ? actionDropdownOptions[appType] || [] : [];

  const exportOptions = 
  selectedAction ? exportEventsByAction[selectedAction] || [] 
  : [];

  const isFormValid =
  selectedAction &&
  selectedExport &&
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
  export: selectedExport,
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
            onChange={(e) => {
                setSelectedAction(e.target.value)
                setSelectedExport("") // Reset export when action changes
                }}
            className="w-full px-3 py-2 bg-[#2a2e3f] border border-[#3a3f52] rounded-md text-white focus:outline-none focus:border-[#6d3be4]"
          >
            <option value="" disabled>
              Choose an action
            </option>
            {actionOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
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
        {/* Export Options Dropdown */}
{selectedAction && (
  <div className="flex flex-col gap-2 pt-3">
    <label className="text-sm font-medium text-[#c5c5d2]">Select Export Option</label>
    {exportOptions.length > 0 ? (
      <select
        value={selectedExport}
        onChange={(e) => setSelectedExport(e.target.value)}
        className="w-full px-3 py-2 bg-[#2a2e3f] border border-[#3a3f52] rounded-md text-white focus:outline-none focus:border-[#6d3be4]"
      >
        <option value="" disabled>
          Choose export value
        </option>
        {exportOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    ) : (
      <div className="text-sm text-[#9b9bab] p-3 bg-[#2a2e3f] rounded-lg">
        No export options available for this action
      </div>
    )}
  </div>
)}
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