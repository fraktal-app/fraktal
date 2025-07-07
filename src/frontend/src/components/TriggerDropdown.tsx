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
    { value: "balance-above-threshold", label: "Balance Above Threshold", icon: TrendingUp },
    { value: "balance-below-threshold", label: "Balance Below Threshold", icon: TrendingUp },
    { value: "new-transaction", label: "New Transaction", icon: TrendingUp },
  ],
  "token-price": [{ value: "price-threshold", label: "Token value crosses a threshold", icon: Coins }],
}

// New structure: export options based on specific events
const exportEventsByEvent: Record<string, Array<{ value: string; label: string; icon: any }>> = {
  // Gmail events
  "new-email": [
    { value: "email-body", label: "Email Body", icon: Mail },
    { value: "sender-name", label: "Sender Name", icon: Mail },
    { value: "everything", label: "Everything", icon: Mail },
  ],
  
  // Discord events
  "new-message": [
    { value: "messenger-detail", label: "Messenger Detail", icon: MessageSquare },
    { value: "message-content", label: "Message Content", icon: MessageSquare },
    { value: "everything", label: "Everything", icon: MessageSquare },
  ],
  "mention-received": [
    { value: "messenger-detail", label: "Messenger Detail", icon: MessageSquare },
    { value: "command", label: "Command", icon: MessageSquare },
    { value: "everything", label: "Everything", icon: MessageSquare },
  ],
  
  // Telegram events (reusing same event keys but with different context)
  "new-message-telegram": [
    { value: "messenger-detail", label: "Messenger Detail", icon: Send },
    { value: "message-content", label: "Message Content", icon: Send },
    { value: "everything", label: "Everything", icon: Send },
  ],
  "bot-command": [
    { value: "messenger-detail", label: "Messenger Detail", icon: Send },
    { value: "command", label: "Command", icon: Send },
    { value: "everything", label: "Everything", icon: Send },
  ],
  
  // GitHub events
  "new-issue": [
    { value: "contributor-detail", label: "Contributor Detail", icon: Github },
    { value: "issue-content", label: "Issue Content", icon: Github },
    { value: "everything", label: "Everything", icon: Github },
  ],
  "new-pr": [
    { value: "contributor-detail", label: "Contributor Detail", icon: Github },
    { value: "pr-content", label: "Pull Request Content", icon: Github },
    { value: "everything", label: "Everything", icon: Github },
  ],
  "new-commit": [
    { value: "contributor-detail", label: "Contributor Detail", icon: Github },
    { value: "commit-content", label: "Commit Content", icon: Github },
    { value: "everything", label: "Everything", icon: Github },
  ],
  "issue-closed": [
    { value: "contributor-detail", label: "Contributor Detail", icon: Github },
    { value: "issue-content", label: "Issue Content", icon: Github },
    { value: "everything", label: "Everything", icon: Github },
  ],
  
  // Wallet tracking events
  "balance-above-threshold": [
    { value: "current-balance", label: "Current Balance", icon: TrendingUp },
    { value: "balance-change", label: "Change in Balance", icon: TrendingUp },
    { value: "everything", label: "Everything", icon: TrendingUp },
  ],
  "balance-below-threshold": [
    { value: "current-balance", label: "Current Balance", icon: TrendingUp },
    { value: "balance-change", label: "Change in Balance", icon: TrendingUp },
    { value: "everything", label: "Everything", icon: TrendingUp },
  ],
  "new-transaction": [
    { value: "current-balance", label: "Current Balance", icon: TrendingUp },
    { value: "transaction-detail", label: "Transaction Detail", icon: TrendingUp },
    { value: "everything", label: "Everything", icon: TrendingUp },
  ],
  
  // Token price events
  "price-threshold": [
    { value: "current-token-price", label: "Current Token Price", icon: Coins },
  ],
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
  
  // Get export options based on selected event and app type
  const getExportOptions = () => {
    if (!selectedEvent) return []
    
    // Handle special case for telegram new-message to avoid conflict with discord
    if (appType === "telegram" && selectedEvent === "new-message") {
      return exportEventsByEvent["new-message-telegram"] || []
    }
    
    return exportEventsByEvent[selectedEvent] || []
  }
  
  const exportOptions = getExportOptions()
  const credentialFields = appType ? inputFieldsByApp[appType] || [] : []
  const selectedEventOption = eventOptions.find((option) => option.value === selectedEvent)

  const handleCredentialChange = (key: string, value: string) => {
    setCredentials((prev) => ({ ...prev, [key]: value }))
  }

  const handleEventChange = (eventValue: string) => {
    setSelectedEvent(eventValue)
    // Reset export selection when event changes
    setSelectedExport("")
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
            onChange={handleEventChange}
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

          {/* Export options section - only show when event is selected */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-[#c5c5d2]">Export Options</label>
              <span className="bg-red-500/20 text-red-400 text-xs px-1.5 py-0.5 rounded-full">*</span>
            </div>

            {exportOptions.length > 0 ? (
              <CustomSelect
                options={exportOptions}
                value={selectedExport}
                onChange={setSelectedExport}
                placeholder="Choose what to export"
              />
            ) : (
              <div className="text-sm text-[#9b9bab] p-3 bg-[#2a2e3f] rounded-lg">
                No export options available for this event
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2">
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