import { ChevronDown, Info } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { actionDropdownOptions, actionInputFieldsByApp, exportEventsByAction, customMessageFieldsByAction } from "./actionResponse";
import { outputLinkConfigByApp } from "./outputLinks";
import type { AvailableDataSource, } from "../../../components/workflowBuilder/types";
import ContentEditableWithPillsInput from './DataPill';

type ActionOption = {
  value: string;
  label: string;
  icon: any;
  requiresLinkName?: boolean;
};

type ActionDropdownProps = {
  isOpen: boolean;
  onSave: (formData: { event: string; export: string; [key: string]: string }) => void;
  onCancel: () => void;
  appType?: string;
  initialData?: { [key: string]: any };
  availableDataSources: AvailableDataSource[];
  userId: string;
  workflowId: string;
};

// DataPillSelector and CustomSelect components remain the same
function DataPillSelector({
  sources,
  onSelect,
  onClose,
  position,
}: {
  sources: AvailableDataSource[];
  onSelect: (pill: string) => void;
  onClose: () => void;
  position: { x: number; y: number };
}) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (sources.length === 0) {
    return (
      <div ref={dropdownRef} className="fixed z-50 w-64 bg-[#2a2e3f] border border-[#3a3f52] rounded-lg shadow-lg p-3" style={{ left: position.x, top: position.y }} >
        <p className="text-sm text-[#9b9bab]">No data available from previous steps.</p>
      </div>
    )
  }

  return (
    <div ref={dropdownRef} className="fixed z-50 w-64 bg-[#2a2e3f] border border-[#3a3f52] rounded-lg shadow-lg max-h-60 overflow-auto"style={{ left: position.x, top: position.y }} >
      {sources.map((source) => (
        <div key={source.stepNumber}>
          <h4 className="px-3 py-2 text-xs font-bold text-white uppercase tracking-wider bg-[#1b1f2a]">
            {source.stepNumber}. {source.stepLabel}
          </h4>
          <ul>
            {Object.entries(source.data).map(([key, valueInfo]) => (
              <li key={key}>
                <button
                  onClick={() => onSelect(`{step_${source.stepNumber}.${key}}`)}
                  className="w-full px-3 py-2 text-left text-sm text-white hover:bg-[#3a3f52]"
                  >
                  {(valueInfo as any).label || key}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

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
              <selectedOption.icon className="h-4 w-4 text-[#9b9bab]"/>
              <span>{selectedOption.label}</span>
            </>
          ) : (
            <span className="text-[#9b9bab]">{placeholder}</span>
          )}
        </div>
        <ChevronDown className={`h-4 w-4 text-[#9b9bab] transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-[#2a2e3f] borderborder-[#3a3f52] rounded-lg shadow-lg max-h-60 overflow-auto">
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
  availableDataSources,
  userId: _userId, 
  workflowId: _workflowId,
}: ActionDropdownProps) {
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [selectedAction, setSelectedAction] = useState<string>("");
  const [selectedExport, setSelectedExport] = useState<string>("");
  const [customMessages, setCustomMessages] = useState<Record<string, string>>({});
  const [activePillSelector, setActivePillSelector] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const [dollarTriggerPosition, setDollarTriggerPosition] = useState<number | null>(null);
  const [lastInsertedPill, setLastInsertedPill] = useState<string | null>(null);

  const closePillSelector = () => {
    setActivePillSelector(null);
    setDollarTriggerPosition(null);
  };

  useEffect(() => {
    if (initialData) {
      setSelectedAction(initialData.event || "");
      setSelectedExport(initialData.export || "");
      const customMsgData: Record<string, string> = {};
      Object.keys(initialData).forEach(key => {
        if (key.startsWith('customMessage_')) {
          customMsgData[key] = initialData[key];
        }
      });
      setCustomMessages(customMsgData);
      const creds = { ...initialData };
      delete creds.event;
      delete creds.export;
      delete creds.linkName;
      delete creds.command;
      Object.keys(creds).forEach(key => {
        if (key.startsWith('customMessage_')) {
          delete creds[key];
        }
      });
      setCredentials(creds);
    } else {
        setCredentials({});
        setSelectedAction("");
        setSelectedExport("");
        setCustomMessages({});
    }
  }, [initialData, isOpen]);

  useEffect(() => {
    if (lastInsertedPill) {
      setLastInsertedPill(null);
    }
  }, [lastInsertedPill]);

  const availableActions: ActionOption[] = appType ? actionDropdownOptions[appType] || [] : [];
  const selectedActionObj = availableActions.find(a => a.value === selectedAction);
  const exportOptions = selectedAction ? exportEventsByAction[selectedAction] || [] : [];
  const credentialFields = appType ? actionInputFieldsByApp[appType] || [] : [];
  const customMessageFields = selectedAction ? customMessageFieldsByAction[selectedAction] || [] : [];
  const isCustomMessagesValid = customMessageFields.every(field => !field.required || customMessages[`customMessage_${selectedAction}_${field.key}`]?.trim());

  const isFormValid = Boolean(
    selectedAction &&
    (exportOptions.length === 0 || selectedExport) &&
    credentialFields.every(field => !field.required || credentials[field.key]?.trim()) && 
    isCustomMessagesValid
  );

  const handleDataMappingChange = (key: string, value: string) => {
    // ✅ UPDATED: Logic to close the dropdown if the '$' is removed or typed after.
    if (activePillSelector === key && dollarTriggerPosition !== null) {
      const typedAfter = value.length > dollarTriggerPosition + 1 && value[dollarTriggerPosition + 1] !== '{';
      const dollarRemoved = value[dollarTriggerPosition] !== '$';

      if (typedAfter || dollarRemoved) {
          closePillSelector();
      }
    }

    if (key.startsWith('customMessage_')) {
      setCustomMessages(prev => ({ ...prev, [key]: value }));
    } else {
      setCredentials(prev => ({ ...prev, [key]: value }));
    }
  };

  const handlePillTrigger = (key: string, element: HTMLElement, _currentValue: string, cursorPosition: number) => {
      const rect = element.getBoundingClientRect();
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setDropdownPosition({
        x: rect.left + scrollLeft,
        y: rect.bottom + scrollTop + 5
      });
      setDollarTriggerPosition(cursorPosition - 1);
      setActivePillSelector(key);
  };
  
  const handlePillSelect = (pill: string) => {
    if (activePillSelector && dollarTriggerPosition !== null) {
      const currentValue = activePillSelector.startsWith('customMessage_') 
        ? customMessages[activePillSelector] || ''
        : credentials[activePillSelector] || '';
      
      let newValue = 
        currentValue.slice(0, dollarTriggerPosition) + 
        pill + 
        currentValue.slice(dollarTriggerPosition + 1);
      
        newValue = newValue.replace(/\$/g, '');
      if (activePillSelector.startsWith('customMessage_')) {
        setCustomMessages(prev => ({ ...prev, [activePillSelector]: newValue }));
      } else {
        setCredentials(prev => ({ ...prev, [activePillSelector]: newValue }));
      }
      setLastInsertedPill(pill);
    }
    closePillSelector();
  };

  const handleSave = () => {
    if (isFormValid) {
      const formData: { event: string; export: string; [key: string]: string } = {
        ...credentials,
        ...customMessages,
        event: selectedAction,
        export: selectedExport,
      };

      if (appOutputLinkConfig && selectedActionObj?.requiresLinkName) {
        // const extraData = appOutputLinkConfig.getSaveData({}); 
        // Object.assign(formData, extraData);
      }

      onSave(formData);
    }
  };
  
  const handleCancel = () => { onCancel() };
  const appOutputLinkConfig = appType ? outputLinkConfigByApp[appType] : undefined;
  const AppSpecificComponent = appOutputLinkConfig?.Component;

  if (!isOpen) return null;

  return (
    <div className="mt-3 p-4 bg-[#1b1f2a] border border-[#3a3f52] rounded-lg space-y-4">
      <div>
        <h3 className="text-sm font-medium text-white mb-2">Configure Action</h3>
        <p className="text-xs text-[#9b9bab] mb-3">Select an action and enter required credentials. For fields that support it, type $ to insert data from previous steps.</p>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#c5c5d2]">Select Action</label>
        <CustomSelect
          options={availableActions}
          value={selectedAction}
          onChange={(value: string) => {
            setSelectedAction(value);
            setSelectedExport("");
            setCustomMessages({});
          }}
          placeholder="Select an action"
        />
      </div>

      <div className="space-y-3">
        {credentialFields.map((field) => (
          <div className="flex flex-col gap-2" key={field.key}>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-[#c5c5d2]">{field.label}</label>
              {field.allowDataMapping && (<span className="text-xs font-mono text-[#a37ff0] bg-[#6d3be4]/20 px-1.5 py-0.5 rounded-md" title="Data mapping available">$</span>)}
              {field.required && (<span className="bg-red-500/20 text-red-400 text-xs px-1.5 py-0.5 rounded-full">*</span>)}
            </div>
            <div className="relative">
              {field.allowDataMapping ? (
                 <ContentEditableWithPillsInput
                  value={credentials[field.key] || ""}
                  onChange={(newValue) => handleDataMappingChange(field.key, newValue)}
                  onPillTrigger={(el, val, pos) => handlePillTrigger(field.key, el, val, pos)}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2 bg-[#2a2e3f] border border-[#3a3f52] rounded-md text-white focus:outline-none focus:border-[#6d3be4] pr-10"
                  lastInsertedPill={lastInsertedPill}
                />
              ) : field.type === "textarea" ? (
                <textarea
                  value={credentials[field.key] || ""}
                  onChange={(e) => handleDataMappingChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  maxLength={field.maxLength}
                  className="w-full px-3 py-2 bg-[#2a2e3f] border border-[#3a3f52] rounded-md text-white focus:outline-none focus:border-[#6d3be4] pr-10"
                />
              ) : (
                <input
                  type={field.type}
                  value={credentials[field.key] || ""}
                  onChange={(e) => handleDataMappingChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2 bg-[#2a2e3f] border border-[#3a3f52] rounded-md text-white focus:outline-none focus:border-[#6d3be4] pr-10"
                />
              )}
              {field.allowDataMapping && (<button type="button" className="absolute top-1/2 right-3 -translate-y-1/2 text-[#9b9bab] hover:text-white cursor-help" title="Type $ to insert data from a previous step."><Info className="h-4 w-4"/></button>)}
            </div>
          </div>
        ))}
      </div>

      {customMessageFields.map((field) => {
        const fieldKey = `customMessage_${selectedAction}_${field.key}`;
        return (
          <div className="flex flex-col gap-2" key={fieldKey}>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-[#c5c5d2]">{field.label}</label>
               {field.allowDataMapping && (<span className="text-xs font-mono text-[#a37ff0] bg-[#6d3be4]/20 px-1.5 py-0.5 rounded-md" title="Data mapping available">$</span>)}
              {field.required && (<span className="bg-red-500/20 text-red-400 text-xs px-1.5 py-0.5 rounded-full">*</span>)}
            </div>
            <div className="relative">
              <ContentEditableWithPillsInput
                value={customMessages[fieldKey] || ""}
                onChange={(newValue) => handleDataMappingChange(fieldKey, newValue)}
                onPillTrigger={(el, val, pos) => handlePillTrigger(fieldKey, el, val, pos)}
                placeholder={field.placeholder}
                rows={4}
                className="w-full px-3 py-2 bg-[#2a2e3f] border border-[#3a3f52] rounded-md text-white focus:outline-none focus:border-[#6d3be4] resize-none pr-10"
                lastInsertedPill={lastInsertedPill}
              />
               {field.allowDataMapping && (<button type="button" className="absolute top-2.5 right-3 text-[#9b9bab] hover:text-white cursor-help" title="Type $ to insert datafrom a previous step."><Info className="h-4 w-4"/></button>)}
            </div>
            {field.description && (<p className="text-xs text-[#9b9bab]">{field.description}</p>)}
          </div>
        );
      })}

      {AppSpecificComponent && selectedActionObj?.requiresLinkName && (<AppSpecificComponent {...appOutputLinkConfig.propBuilder({})} />)}
      {selectedAction && (
        <div className="flex flex-col gap-2 pt-3">
          <label className="text-sm font-medium text-[#c5c5d2]">Select Export Option</label>
          {exportOptions.length > 0 ? (
            <select
              value={selectedExport}
              onChange={(e) => setSelectedExport(e.target.value)}
              className="w-full px-3 py-2 bg-[#2a2e3f] border border-[#3a3f52] rounded-md text-white focus:outline-none focus:border-[#6d3be4]"
            >
              <option value="" disabled>Choose export value</option>
              {exportOptions.map((option) => (<option key={option.value} value={option.value}>{option.label}</option>))}
            </select>
          ) : (<div className="text-sm text-[#9b9bab] p-3 bg-[#2a2e3f] rounded-lg">No export options available for this action</div>)}
        </div>
      )}
      <div className="flex justify-between gap-2 pt-2">
        <button onClick={handleCancel} className="px-3 py-1 text-sm font-medium text-[#9b9bab] bg-[#2a2e3f] border border-[#3a3f52] rounded-md hover:bg-[#3a3f52]">Cancel</button>
        <button onClick={handleSave} disabled={!isFormValid} className="px-3 py-1 text-sm font-medium text-white bg-[#6d3be4] border border-transparent rounded-md hover:bg-[#5a2fc7] disabled:opacity-50 disabled:cursor-not-allowed">Save Configuration</button>
      </div>
      {activePillSelector && (<DataPillSelector sources={availableDataSources} onSelect={handlePillSelect} onClose={closePillSelector} position={dropdownPosition} />)}
    </div>
  )
}