import { ChevronDown, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { exportEventsByApp, inputFieldsByApp, triggerEventsByApp } from "./triggerEvents";
import { outputLinkConfigByApp } from "./outputLinks";

type TriggerOption = {
  value: string;
  label: string;
  icon: any;
  requiresLinkName?: boolean;
};

function CustomSelect({
  options,
  value,
  onChange,
  placeholder,
  className = "",
}: {
  options: TriggerOption[]
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

function MultiSelectDropdown({
  options,
  selectedValues,
  onSave,
  placeholder = "Select...",
}: {
  options: { value: string; label: string }[];
  selectedValues: string[];
  onSave: (newValues: string[]) => void;
  placeholder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempSelection, setTempSelection] = useState<string[]>(selectedValues);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync temp state when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setTempSelection(selectedValues);
    }
  }, [isOpen, selectedValues]);

  // Click outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const handleToggle = (value: string) => {
    setTempSelection(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  const handleOk = () => {
    onSave(tempSelection);
    setIsOpen(false);
  };

  const displayText =
    selectedValues.length > 0
      ? `${selectedValues.length} item(s) selected`
      : placeholder;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-10 px-3 py-2 bg-[#2a2e3f] border border-[#3a3f52] rounded-lg text-left flex items-center justify-between hover:border-[#4a4f62] text-white"
      >
        <span>{displayText}</span>
        <ChevronDown className={`h-4 w-4 text-[#9b9bab] transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-[#2a2e3f] border border-[#3a3f52] rounded-lg shadow-lg p-3">
          <div className="space-y-2 max-h-40 overflow-y-auto mb-2">
            {options.map(option => (
              <label key={option.value} className="flex items-center gap-3 cursor-pointer text-white p-1 rounded-md hover:bg-[#3a3f52]">
                {/* Container for the custom checkbox */}
                <div className="relative w-4 h-4 flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={tempSelection.includes(option.value)}
                    onChange={() => handleToggle(option.value)}
                    className="absolute opacity-0 w-full h-full cursor-pointer peer"
                  />
                  {/* Background box */}
                  <div className="w-full h-full rounded bg-[#2a2e3f] border border-[#3a3f52] peer-checked:bg-[#6d3be4] peer-checked:border-[#6d3be4] transition-colors"></div>
                  {/* Checkmark Icon */}
                  <Check className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
                <span>{option.label}</span>
              </label>
            ))}
          </div>
          <button
            onClick={handleOk}
            className="w-full px-3 py-1 text-sm font-medium text-white bg-[#6d3be4] border border-transparent rounded-md hover:bg-[#5a2fc7]"
          >
            OK
          </button>
        </div>
      )}
    </div>
  );
}


export default function TriggerDropdown({
  isOpen,
  onSave,
  onCancel,
  appType,
  userId,
  workflowId,
  initialData,
}: {
  isOpen: boolean
  onSave: (formData: { event: string; export: string[]; [key: string]: any }) => void;
  onCancel: () => void
  appType?: string
  userId: string
  workflowId: string
  initialData?: { [key:string]: any }; 
}) {
  const [credentials, setCredentials] = useState<Record<string, string>>({})
  const [selectedTrigger, setSelectedTrigger] = useState<string>("")
  const [selectedExport, setSelectedExport] = useState<string[]>([])
  const [  botToken, setBotToken] = useState<string>("")
  const [  guildId, setGuildId] = useState<string>("")
  const [  channelId, setChannelId] = useState<string>("")

   useEffect(() => {
    if (initialData) {
      setSelectedTrigger(initialData.event || "");
      const initialExports = initialData.export ? (Array.isArray(initialData.export) ? initialData.export : [initialData.export]) : [];
      setSelectedExport(initialExports);
      setBotToken(initialData.botToken || "");
      setGuildId(initialData.guildId || ""); 
      setChannelId(initialData.channelId || ""); 

      const creds = { ...initialData };
      // Clean known fields from credentials object
      delete creds.event;
      delete creds.export;
      delete creds.linkName;
      delete creds.command;
      delete creds.guildId;
      delete creds.channelId;
      delete creds.botToken;
      setCredentials(creds);
    }
  }, [initialData]);

  const resolvedWorkflowId = workflowId || localStorage.getItem("workflowId") || "<unknown>"
  const resolvedUserId = userId || localStorage.getItem("userId") || "<unknown>"

  const availableTriggers: TriggerOption[] = appType ? triggerEventsByApp[appType] || [] : []
  const selectedTriggerObj = availableTriggers.find(t => t.value === selectedTrigger)

  const availableExports = exportEventsByApp[selectedTrigger] || []
  const credentialFields = appType ? inputFieldsByApp[appType] || [] : []

  const isFormValid = Boolean(
  selectedTrigger &&
  selectedExport.length > 0 &&
  (appType !== "telegram" || botToken.trim() !== "") &&
  (appType !== "discord" || (guildId.trim() !== "" && channelId.trim() !== "")) &&
  credentialFields.every(field => !field.required || credentials[field.key]?.trim())
);



  const handleCredentialChange = (key: string, value: string) => {
    setCredentials((prev) => ({ ...prev, [key]: value }))
  }
  
  const handleSave = () => {
    if (isFormValid) {
      const formData: { event: string; export: string[]; [key: string]: any } = {
        ...credentials,
        event: selectedTrigger,
        export: selectedExport,
      };
      
      if (appOutputLinkConfig && selectedTriggerObj?.requiresLinkName) {
        const extraData = appOutputLinkConfig.getSaveData({
          botToken,
          guildId,
          channelId,
          userId: resolvedUserId,
          workflowId: resolvedWorkflowId,
        });
        Object.assign(formData, extraData);
      }
      
      onSave(formData);
    }
  };
  
  const handleCancel = () => {
    setCredentials({})
    onCancel()
  }
  
  const appOutputLinkConfig = appType ? outputLinkConfigByApp[appType] : undefined;
  const AppSpecificComponent = appOutputLinkConfig?.Component;

  if (!isOpen) return null

  return (
    <div className="mt-3 p-4 bg-[#1b1f2a] border border-[#3a3f52] rounded-lg space-y-4">
      <div>
        <h3 className="text-sm font-medium text-white mb-2">Configure Trigger</h3>
        <p className="text-xs text-[#9b9bab] mb-3">Select a trigger event and enter required credentials below</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[#c5c5d2]">Select Event</label>
        <CustomSelect
          options={availableTriggers}
          value={selectedTrigger}
          onChange={setSelectedTrigger}
          placeholder="Select a trigger"
        />
      </div>

      <div className="space-y-3">
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

       {AppSpecificComponent && selectedTriggerObj?.requiresLinkName && (
        <AppSpecificComponent
          {...appOutputLinkConfig.propBuilder({
            botToken,
            onBotTokenChange: setBotToken,
            userId: resolvedUserId,
            workflowId: resolvedWorkflowId,
            guildId, 
            channelId,
            onGuildChange: setGuildId,
            onChannelChange: setChannelId,
          })}
        />
      )}

      {selectedTrigger && availableExports.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#c5c5d2]">Select Export Data</label>
          <MultiSelectDropdown
            options={availableExports}
            selectedValues={selectedExport}
            onSave={setSelectedExport}
            placeholder="Select export data"
          />
        </div>
      )}

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