import { useState, useRef, useEffect } from "react"
import {
  Mail,
  FileText,
  ChevronDown,
  MessageSquare,
  Send,
  Github,
  Webhook,
  TrendingUp,
  Coins,
} from "lucide-react"

const triggerEventsByApp: Record<string, Array<{ value: string; label: string; icon: any }>> = {
  gmail: [
    { value: "new-email", label: "New Email Received", icon: Mail },
    // { value: "starred-email", label: "Email Starred", icon: Mail },
    // { value: "email-with-attachment", label: "Email with Attachment", icon: Mail },
    // { value: "email-from-sender", label: "Email from Specific Sender", icon: Mail },
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
  
  // stripe: [
  //   { value: "payment-received", label: "Payment Received", icon: CreditCard },
  //   { value: "subscription-created", label: "New Subscription", icon: CreditCard },
  //   { value: "payment-failed", label: "Payment Failed", icon: CreditCard },
  //   { value: "refund-created", label: "Refund Created", icon: CreditCard },
  // ],
  // paypal: [
  //   { value: "payment-received", label: "Payment Received", icon: Wallet },
  //   { value: "subscription-created", label: "Subscription Created", icon: Wallet },
  //   { value: "dispute-created", label: "Dispute Created", icon: Wallet },
  // ],
  forms: [
    { value: "new-response", label: "New Response Received", icon: FileText },
  ],
  webhook: [
    { value: "webhook-received", label: "Webhook Received", icon: Webhook },
  ],
  // icp: [
  //   { value: "transaction-received", label: "Transaction Received", icon: Coins },
  //   { value: "balance-changed", label: "Balance Changed", icon: Coins },
  //   { value: "token-transfer", label: "Token Transfer", icon: Coins },
  // ],
  "wallet-tracking": [
    { value: "balance-threshold", label: "Balance Above/Below Threshold", icon: TrendingUp },
    { value: "new-transaction", label: "New Transaction", icon: TrendingUp },
  ],
  "token-price": [
    { value: "price-threshold", label: "Token value crosses a threshold", icon: Coins },
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
  onSave: (formData: { event: string; clientId?: string; clientPassword?: string }) => void
  onCancel: () => void
  appType?: string
}) {
  const [selectedEvent, setSelectedEvent] = useState("")
  const [clientId, setClientId] = useState("")
  const [clientPassword, setClientPassword] = useState("")

  const eventOptions = appType ? triggerEventsByApp[appType] || [] : []

  const handleSave = () => {
    if (selectedEvent && clientId && clientPassword) {
      onSave({ event: selectedEvent, clientId, clientPassword })
      setSelectedEvent("")
      setClientId("")
      setClientPassword("")
    }
  }

  const handleCancel = () => {
    setSelectedEvent("")
    setClientId("")
    setClientPassword("")
    onCancel()
  }

  const selectedEventOption = eventOptions.find((option) => option.value === selectedEvent)

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

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-[#c5c5d2]">Client ID</label>
              <span className="bg-red-500/20 text-red-400 text-xs px-1.5 py-0.5 rounded-full">*</span>
            </div>
            <input
              type="text"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              placeholder="Enter Client ID"
              className="w-full px-3 py-2 bg-[#2a2e3f] border border-[#3a3f52] rounded-md text-white focus:outline-none focus:border-[#6d3be4]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-[#c5c5d2]">Client Secret</label>
              <span className="bg-red-500/20 text-red-400 text-xs px-1.5 py-0.5 rounded-full">*</span>
            </div>
            <input
              type="password"
              value={clientPassword}
              onChange={(e) => setClientPassword(e.target.value)}
              placeholder="Enter Client Password"
              className="w-full px-3 py-2 bg-[#2a2e3f] border border-[#3a3f52] rounded-md text-white focus:outline-none focus:border-[#6d3be4]"
            />
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <button
          onClick={handleCancel}
          className="px-3 py-1.5 text-sm font-medium text-[#9b9bab] bg-[#2a2e3f] border border-[#3a3f52] rounded-md hover:bg-[#3a3f52]"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!selectedEvent || !clientId || !clientPassword}
          className="px-3 py-1.5 text-sm font-medium text-white bg-[#6d3be4] border border-transparent rounded-md hover:bg-[#5a2fc7] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Configuration
        </button>
      </div>
    </div>
  )
}
