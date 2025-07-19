import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { actionDropdownOptions, actionInputFieldsByApp, exportEventsByAction } from "./actionResponse";
import { outputLinkConfigByApp } from "./outputLinks";


type ActionOption = {
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
  options: ActionOption[]
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


export default function ActionDropdown({
  isOpen,
  onSave,
  onCancel,
  appType,
  initialData,
}: {
  isOpen: boolean
  onSave: (formData: { event: string; export: string; [key: string]: string }) => void;
  onCancel: () => void
  appType?: string
  userId: string
  workflowId: string
  initialData?: { [key: string]: any };
}) {
  const [credentials, setCredentials] = useState<Record<string, string>>({})
  const [selectedAction, setSelectedAction] = useState<string>("")
  const [selectedExport, setSelectedExport] = useState<string>("")



  useEffect(() => {
    if (initialData) {
      setSelectedAction(initialData.event || "");
      setSelectedExport(initialData.export || "");
   


      const creds = { ...initialData };
      delete creds.event;
      delete creds.export;
      delete creds.linkName;
      delete creds.command;
      setCredentials(creds);
    }
  }, [initialData]);

  const availableActions: ActionOption[] = appType ? actionDropdownOptions[appType] || [] : []
  const selectedActionObj = availableActions.find(a => a.value === selectedAction)


    const exportOptions = 
    selectedAction ? exportEventsByAction[selectedAction] || [] 
    : [];  
    const credentialFields = appType ? actionInputFieldsByApp[appType] || [] : []


  const isFormValid = Boolean(
    selectedAction &&
    (exportOptions.length === 0 || selectedExport) && 
    credentialFields.every(field => !field.required || credentials[field.key]?.trim())
  );


  const handleCredentialChange = (key: string, value: string) => {
    setCredentials((prev) => ({ ...prev, [key]: value }))
  }


  const handleSave = () => {
    if (isFormValid) {
      const formData: { event: string; export: string; [key: string]: string } = {
        ...credentials,
        event: selectedAction,
        export: selectedExport,
      };
      
      if (appOutputLinkConfig && selectedActionObj?.requiresLinkName) {
        const extraData = appOutputLinkConfig.getSaveData({
          
         
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
        <h3 className="text-sm font-medium text-white mb-2">Configure Action</h3>
        <p className="text-xs text-[#9b9bab] mb-3">Select an action and enter required credentials below</p>
      </div>


      <div className="space-y-2">
        <label className="text-sm font-medium text-[#c5c5d2]">Select Action</label>
        <CustomSelect
          options={availableActions}
          value={selectedAction}
          onChange={(value) => {
            setSelectedAction(value)
            setSelectedExport("") 
          }}
          placeholder="Select an action"
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
            
            {field.type === "textarea" ? (
              <textarea
                value={credentials[field.key] || ""}
                onChange={(e) => handleCredentialChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                maxLength={field.maxLength}
                className="w-full px-3 py-2 bg-[#2a2e3f] border border-[#3a3f52] rounded-md text-white focus:outline-none focus:border-[#6d3be4]"
              />
            ) : (
              <input
                type={field.type}
                value={credentials[field.key] || ""}
                onChange={(e) => handleCredentialChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="w-full px-3 py-2 bg-[#2a2e3f] border border-[#3a3f52] rounded-md text-white focus:outline-none focus:border-[#6d3be4]"
              />
            )}
          </div>
        ))}
      </div>


      {AppSpecificComponent && selectedActionObj?.requiresLinkName && (
        <AppSpecificComponent
          {...appOutputLinkConfig.propBuilder({
          })}
        />
      )}


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