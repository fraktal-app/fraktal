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
  gmail: [
    { key: "clientId", label: "Client ID", placeholder: "Enter Client ID", type: "text", required: true },
    { key: "clientSecret", label: "Client Secret", placeholder: "Enter Client Secret", type: "password", required: true },
  ],
  discord: [
    { key: "client", label: "token id", placeholder: "Enter token ID", type: "text", required: true }
  ],
  telegram: [
  { key: "botToken", label: "Bot Token", placeholder: "Enter your Telegram Bot Token", type: "text", required: true },
  { key: "chatId", label: "Chat ID", placeholder: "Enter Chat ID to listen for messages", type: "text", required: true }
  ],
  "wallet-tracking": [
  { key: "walletAddress", label: "Wallet Address", placeholder: "Enter wallet address to track", type: "text", required: true },
  { key: "network", label: "Network", placeholder: "e.g., Ethereum, Solana", type: "text", required: true }
  ],
  "token-price": [
  { key: "tokenSymbol", label: "Token Symbol", placeholder: "e.g., ETH, BTC", type: "text", required: true },
  { key: "threshold", label: "Price Threshold", placeholder: "Enter price threshold (e.g., 2500)", type: "text", required: true },
  { key: "direction", label: "Direction", placeholder: "above or below", type: "text", required: true }
]
}

const triggerEventsByApp: Record<string, Array<{ value: string; label: string; icon: any }>> = {
  gmail: [
    { value: "new-email", label: "New Email Received", icon: Mail },
  ],
  github: [
    { value: "new-issue", label: "New Issue Created", icon: Github },
    { value: "new-pr", label: "New Pull Request", icon: Github },
    { value: "pr-merged", label: "Pull Request Merged", icon: Github },
    { value: "new-commit", label: "New Commit Pushed", icon: Github },
    { value: "issue-closed", label: "Issue Closed", icon: Github },
  ],
  discord: [
    { value: "new-message", label: "New Message in Channel", icon: MessageSquare },
    { value: "mention-received", label: "Bot Mentioned", icon: MessageSquare },
  ],
  telegram: [
    { value: "new-message", label: "New Message Received", icon: Send },
    { value: "bot-command", label: "Bot Command Received", icon: Send },
  ],
  "wallet-tracking": [
    { value: "balance-threshold", label: "Balance Above/Below Threshold", icon: TrendingUp },
    { value: "new-transaction", label: "New Transaction", icon: TrendingUp },
  ],
  "token-price": [{ value: "price-threshold", label: "Token value crosses a threshold", icon: Coins }],
}

const exportEventsByApp: Record<string, Array<{ value: string; label: string; icon: any }>> = {
  gmail: [
    { value: "email-body", label: "Email body", icon: Mail },
    { value: "email-sender", label: "Sender name", icon: Mail },
    { value: "email-everything", label: "Everything", icon: Mail },
  ],
  github: [
    { value: "contributor-detail", label: "Contributor detail", icon: Github },
    { value: "everything", label: "Everything", icon: Github },
  ],
  discord: [
    { value: "user-detail", label: "User detail", icon: MessageSquare },
    { value: "content", label: "Content", icon: MessageSquare },
    { value: "everything", label: "Everything", icon: MessageSquare },
  ],
  telegram: [
    { value: "user-detail", label: "User detail", icon: Send },
    { value: "content", label: "Content", icon: Send },
    { value: "everything", label: "Everything", icon: Send },
  ],
  "wallet-tracking": [
    { value: "Current-balnce", label: "Current balance", icon: TrendingUp },
    { value: "balance-change", label: " Chnage in balance", icon: TrendingUp },
    { value: "transaction-detail", label: "Transaction detail", icon: TrendingUp },
  ],
  "token-price": [{ value: "curent-price", label: "Current token price", icon: Coins }],
}

function CustomSelect({
  options,
  value,
  onChange,
  placeholder,
  className = "",
}: {
  options: Array<{ value: string; label: string; icon: any }>
  value: string
  onChange: (value: string) => void
  placeholder: string
  className?: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const selectedOption = options.find((option) => option.value === value)

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-10 px-3 py-2 bg-[#2a2e3f] border border-[#3a3f52] rounded-lg text-left flex items-center justify-between hover:border-[#4a4f62] text-white"
      >
        <div className="flex items-center gap-2">
          {selectedOption ? (
            <>
              <selectedOption.icon className="h-4 w-4 text-[#9b9bab]" />
              <span>{selectedOption.label}</span>
            </>
          ) : (
            <span className="text-[#9b9bab]">{placeholder}</span>
          )}
        </div>
        <ChevronDown className={`h-4 w-4 text-[#9b9bab] transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-[#2a2e3f] border border-[#3a3f52] rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
              className="w-full px-3 py-2 text-left hover:bg-[#3a3f52] flex items-center gap-2 text-white"
            >
              <option.icon className="h-4 w-4 text-[#9b9bab]" />
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function TriggerDropdown({
  isOpen,
  onSave,
  onCancel,
  appType,
}: {
  isOpen: boolean
  onSave: (formData: { event: string; [key: string]: string; export: string }) => void
  onCancel: () => void
  appType?: string
}) {
  const [selectedEvent, setSelectedEvent] = useState("")
  const [selectedExport, setSelectedExport] = useState("")

  const [credentials, setCredentials] = useState<Record<string, string>>({})

  const eventOptions = appType ? triggerEventsByApp[appType] || [] : []
  const exportOptions = appType ? exportEventsByApp[appType] || [] : []
  const credentialFields = appType ? inputFieldsByApp[appType] || [] : []
  const selectedEventOption = eventOptions.find((option) => option.value === selectedEvent)

  const handleCredentialChange = (key: string, value: string) => {
    setCredentials((prev) => ({ ...prev, [key]: value }))
  }

  const isFormValid =
    selectedEvent &&
    credentialFields.every((field) => !field.required || credentials[field.key]?.trim()) &&
    selectedExport

  const handleSave = () => {
    if (isFormValid) {
      onSave({ event: selectedEvent, ...credentials, export: selectedExport})
      setSelectedEvent("")
      setCredentials({})
      setSelectedExport("")
    }
  }

  const handleCancel = () => {
    setSelectedEvent("")
    setCredentials({})
    setSelectedExport("")
    onCancel()
  }

  if (!isOpen) return null

  return (
    <div className="mt-3 p-4 bg-[#1b1f2a] border border-[#3a3f52] rounded-lg space-y-4">
      <div>
        <h3 className="text-sm font-medium text-white mb-2">Configure Trigger</h3>
        <p className="text-xs text-[#9b9bab] mb-3">Configure when this {appType} trigger should activate</p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-[#c5c5d2]">Trigger event</label>
          <span className="bg-red-500/20 text-red-400 text-xs px-1.5 py-0.5 rounded-full">*</span>
        </div>

        {eventOptions.length > 0 ? (
          <CustomSelect
            options={eventOptions}
            value={selectedEvent}
            onChange={setSelectedEvent}
            placeholder="Choose an event"
          />
        ) : (
          <div className="text-sm text-[#9b9bab] p-3 bg-[#2a2e3f] rounded-lg">
            No trigger events available for this app
          </div>
        )}
      </div>

      {selectedEventOption && (
        <div className="space-y-3">
          <div className="bg-[#2a2e3f] rounded-lg p-3 space-y-2">
            <h4 className="text-sm font-medium text-[#9b9bab]">Preview</h4>
            <div className="flex items-center gap-2 text-sm text-[#c5c5d2]">
              <selectedEventOption.icon className="h-4 w-4" />
              <span>When: {selectedEventOption.label}</span>
            </div>
          </div>

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
      )}

      <div className="flex justify-between gap-2 pt-2">
        <div className="space-y-3">
        

        {exportOptions.length > 0 ? (
          <CustomSelect
            options={exportOptions}
            value={selectedExport}
            onChange={setSelectedExport}
            placeholder="Export options"
          />
        ) : (
          <div className="text-sm text-[#9b9bab] p-3 bg-[#2a2e3f] rounded-lg">
            No export for this app
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
    </div>
  )
}
