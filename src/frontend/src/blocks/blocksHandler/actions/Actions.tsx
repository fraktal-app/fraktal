import { ChevronDown, Info, List, MessageSquareReply, PenSquare, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { actionDropdownOptions, actionInputFieldsByApp, exportEventsByAction, customMessageFieldsByAction } from "./actionResponse";
import { outputLinkConfigByApp } from "./outputLinks";
import type { AvailableDataSource,} from "../../../components/workflowBuilder/types";
import type { InputField } from "../../../blocks/common/types";
import ContentEditableWithPillsInput from './DataPill';

const htmlToString = (html: string): string => {
  // ... (no changes in this function)
  let processedHtml = html;

  const tempPillDiv = document.createElement('div');
  tempPillDiv.innerHTML = processedHtml;
  tempPillDiv.querySelectorAll('span[data-pill-value]').forEach(pill => {
    const value = pill.getAttribute('data-pill-value');
    if (value) {
      pill.replaceWith(document.createTextNode(value));
    }
  });
  
  processedHtml = tempPillDiv.innerHTML;

  processedHtml = processedHtml
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/p>/gi, '\n');

  const tempStripDiv = document.createElement('div');
  tempStripDiv.innerHTML = processedHtml;
  let text = tempStripDiv.textContent || '';

  if (text.endsWith('\n')) {
    text = text.slice(0, -1);
  }

  return text.replace(/\u00A0/g, ' ');
};

type ActionOption = {
  value: string;
  label: string;
  icon: any;
  requiresLinkName?: boolean;
};

type ActionDropdownProps = {
  isOpen: boolean;
  onSave: (formData: { [key: string]: any }) => void;
  onCancel: () => void;
  appType?: string;
  initialData?: { [key: string]: any };
  availableDataSources: AvailableDataSource[];
  userId: string;
  workflowId: string;
};

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
  // ... (no changes in this component)
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
        <div key={source.id}>
          <h4 className="px-3 py-2 text-xs font-bold text-white uppercase tracking-wider bg-[#1b1f2a]">
            {source.stepNumber}. {source.stepLabel}
          </h4>
          <ul>
            {Object.entries(source.data).map(([key, valueInfo]) => (
              <li key={key}>
                <button
                  onClick={() => onSelect(`$?{${source.id}.${source.appType}/${key}}`)}
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
  // ... (no changes in this component)
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
          {options.map((option: ActionOption) => (
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
  const [selectedExport, setSelectedExport] = useState<string[]>([]);
  const [customMessages, setCustomMessages] = useState<Record<string, string>>({});
  const [activePillSelector, setActivePillSelector] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const [dollarTriggerPosition, setDollarTriggerPosition] = useState<number | null>(null);
  const [lastInsertedPill, setLastInsertedPill] = useState<{ value: string; instanceIndex: number } | null>(null);
  
  const [chatIdSource, setChatIdSource] = useState<'custom' | 'trigger'>('custom');
  const [discordReplySource, setDiscordReplySource] = useState<'custom' | 'trigger'>('custom');

  const triggerSource = availableDataSources.find(source => source.stepNumber === 1);
  
  const triggerChatIdPill = triggerSource 
      ? `$?{${triggerSource.id}.${triggerSource.appType}/chat_id}`
      : null;

  const triggerGuildIdPill = triggerSource ? `$?{${triggerSource.id}.${triggerSource.appType}/guild_id}` : null;
  const triggerChannelIdPill = triggerSource ? `$?{${triggerSource.id}.${triggerSource.appType}/channel_id}` : null;
  
  const isDiscordReplyScenario = appType === 'discord' && triggerSource?.appType === 'discord';

  const closePillSelector = () => {
    setActivePillSelector(null);
    setDollarTriggerPosition(null);
  };

  useEffect(() => {
    if (initialData) {
      const action = initialData.event || "";
      setSelectedAction(action);
      const initialExports = initialData.export ? (Array.isArray(initialData.export) ? initialData.export : [initialData.export]) : [];
      setSelectedExport(initialExports);

      const currentCredentialKeys = (appType && actionInputFieldsByApp[appType])
        ? actionInputFieldsByApp[appType].map(field => field.key)
        : [];
      const currentCustomMessageKeys = customMessageFieldsByAction[action]
        ? customMessageFieldsByAction[action].map(field => field.key)
        : [];

      const newCredentials: Record<string, any> = {};
      const newCustomMessages: Record<string, string> = {};

      for (const key in initialData) {
        if (Object.prototype.hasOwnProperty.call(initialData, key)) {
            if (currentCredentialKeys.includes(key)) {
                newCredentials[key] = initialData[key];
            }
            if (currentCustomMessageKeys.includes(key)) {
                newCustomMessages[key] = initialData[key];
            }
        }
      }

      const chatIdData = initialData.telegram_chatId;
      if (appType === 'telegram' && chatIdData) {
          if (typeof chatIdData === 'object' && chatIdData !== null && 'isCustom' in chatIdData) {
              setChatIdSource(chatIdData.isCustom ? 'custom' : 'trigger');
              newCredentials.telegram_chatId = chatIdData.text || '';
          } else if (typeof chatIdData === 'string') {
              const oldTriggerPill = '$?{trigger.0.telegram.chatId}';
              const typoTriggerPill = '$?{triggger.telegram.chatId}';
              if ((triggerChatIdPill && chatIdData === triggerChatIdPill) || chatIdData === oldTriggerPill || chatIdData === typoTriggerPill) {
                  setChatIdSource('trigger');
              } else {
                  setChatIdSource('custom');
              }
              newCredentials.telegram_chatId = chatIdData;
          }
      }

      if (isDiscordReplyScenario) {
        if (
          initialData.discord_guildId === triggerGuildIdPill &&
          initialData.discord_channelId === triggerChannelIdPill
        ) {
          setDiscordReplySource('trigger');
        } else {
          setDiscordReplySource('custom');
        }
      }

      setCredentials(newCredentials);
      setCustomMessages(newCustomMessages);

    } else {
      setCredentials({});
      setSelectedAction("");
      setSelectedExport([]);
      setCustomMessages({});
      setChatIdSource('custom');
      setDiscordReplySource('custom');
    }
  }, [initialData, isOpen, appType, triggerChatIdPill, isDiscordReplyScenario, triggerGuildIdPill, triggerChannelIdPill]);

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
  
  const isCustomMessagesValid = customMessageFields.every(field => !field.required || (customMessages[field.key] && customMessages[field.key].trim()));

  const isFormValid = Boolean(
    selectedAction &&
    (exportOptions.length === 0 || selectedExport.length > 0) &&
    credentialFields.every(field => !field.required || (credentials[field.key] && String(credentials[field.key]).trim())) && 
    isCustomMessagesValid
  );
  
  const discordReplyOptions: ActionOption[] = [
    { value: 'custom', label: 'Custom Guild & Channel ID', icon: PenSquare },
    { value: 'trigger', label: 'Reply to Discord Trigger', icon: MessageSquareReply },
  ];

  const chatIdOptions: ActionOption[] = [
    { value: 'custom', label: 'Custom Chat ID', icon: PenSquare },
    { value: 'trigger', label: "Reply to Trigger's Chat ID", icon: MessageSquareReply },
  ];

  const handleDataMappingChange = (key: string, value: string) => {
    // ... (no changes in this function)
    if (activePillSelector === key && dollarTriggerPosition !== null) {
      const isCustomField = customMessageFields.some(field => field.key === key);
      const currentValue = isCustomField ? customMessages[key] : credentials[key];
      const typedAfter = value.length > dollarTriggerPosition + 1 && value[dollarTriggerPosition + 1] !== '{';
      const dollarRemoved = !currentValue || !value.startsWith(String(currentValue).substring(0, dollarTriggerPosition - 1));

      if (typedAfter || dollarRemoved) {
          closePillSelector();
      }
    }

    const isCustomField = customMessageFields.some(field => field.key === key);
    if (isCustomField) {
      setCustomMessages(prev => ({...prev, [key]: value }));    
    } else {
      setCredentials(prev => ({ ...prev, [key]: value }));
    }
  };
  
  // ✨ FIXED: Handler signature now accepts `string` to match CustomSelect prop
  const handleDiscordReplySourceChange = (value: string) => {
    const source = value as 'custom' | 'trigger';
    setDiscordReplySource(source);

    if (source === 'trigger') {
      if (triggerGuildIdPill) handleDataMappingChange('discord_guildId', triggerGuildIdPill);
      if (triggerChannelIdPill) handleDataMappingChange('discord_channelId', triggerChannelIdPill);
    } else {
      handleDataMappingChange('discord_guildId', '');
      handleDataMappingChange('discord_channelId', '');
    }
  };

  // ✨ FIXED: Handler signature now accepts `string` to match CustomSelect prop
  const handleChatIdSourceChange = (value: string) => {
    const source = value as 'custom' | 'trigger';
    setChatIdSource(source);
    if (source === 'trigger' && triggerChatIdPill) {
        handleDataMappingChange('telegram_chatId', triggerChatIdPill);
    } else {
        handleDataMappingChange('telegram_chatId', '');
    }
  };

  const handlePillTrigger = (key: string, element: HTMLElement) => {
      // ... (no changes in this function)
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      
      const range = selection.getRangeAt(0);
      const precedingRange = document.createRange();
      precedingRange.setStart(element, 0);
      precedingRange.setEnd(range.startContainer, range.startOffset);

      const tempDiv = document.createElement('div');
      tempDiv.appendChild(precedingRange.cloneContents());
      const precedingHtml = tempDiv.innerHTML;

      const stringBeforeCursor = htmlToString(precedingHtml);
      const absolutePosition = stringBeforeCursor.length;
      
      const rect = range.getBoundingClientRect();
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setDropdownPosition({
        x: rect.left + scrollLeft,
        y: rect.bottom + scrollTop + 5
      });
      setDollarTriggerPosition(absolutePosition);
      setActivePillSelector(key);
  };
  
  const handlePillSelect = (pill: string) => {
    // ... (no changes in this function)
    if (activePillSelector && dollarTriggerPosition !== null) {
      const isCustomField = customMessageFields.some(field => field.key === activePillSelector);
      
      const currentValue = isCustomField
        ? customMessages[activePillSelector] || ''
        : String(credentials[activePillSelector] || '');
      
      const textBeforeInsertion = currentValue.substring(0, dollarTriggerPosition - 1);
      const escapedPill = pill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const instanceIndex = (textBeforeInsertion.match(new RegExp(escapedPill, 'g')) || []).length;

      const newValue = 
        currentValue.slice(0, dollarTriggerPosition - 1) + 
        pill +
        currentValue.slice(dollarTriggerPosition);
      
      if (isCustomField) {
        setCustomMessages(prev => ({...prev, [activePillSelector]: newValue }));
      } else {
        setCredentials(prev => ({ ...prev, [activePillSelector]: newValue }));
      }
      
      setLastInsertedPill({ value: pill, instanceIndex: instanceIndex });
    }
    closePillSelector();
  };

  const handleSave = () => {
    // ... (no changes in this function)
    if (isFormValid) {
      const finalCredentials: Record<string, any> = { ...credentials };
      
      if (appType === 'telegram' && 'telegram_chatId' in finalCredentials) {
          finalCredentials.telegram_chatId = {
            isCustom: chatIdSource === 'custom',
            text: credentials.telegram_chatId || ''
          };
      }

      const formData: { event: string; export: string[]; [key: string]: any } = {
        ...finalCredentials,
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

  const shouldShowBotLink = appType === 'discord'
    ? !(isDiscordReplyScenario && discordReplySource === 'trigger')
    : selectedActionObj?.requiresLinkName;

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
            setSelectedExport([]);
            setCustomMessages({});
          }}
          placeholder="Select an action"
        />
      </div>

      <div className="space-y-3">
        {isDiscordReplyScenario && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#c5c5d2]">Reply Destination</label>
            <CustomSelect
              options={discordReplyOptions}
              value={discordReplySource}
              onChange={handleDiscordReplySourceChange}
              placeholder="Select reply destination"
            />
          </div>
        )}

        {credentialFields.map((field: InputField) => {
          if (isDiscordReplyScenario && discordReplySource === 'trigger' && (field.key === 'discord_guildId' || field.key === 'discord_channelId')) {
            return null;
          }

          const isTriggerTelegram = triggerSource?.appType === 'telegram';
          if (field.key === 'telegram_chatId' && isTriggerTelegram) {
            
            return (
              <div className="flex flex-col gap-2" key={field.key}>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-[#c5c5d2]">{field.label}</label>
                  {field.required && (<span className="bg-red-500/20 text-red-400 text-xs px-1.5 py-0.5 rounded-full">*</span>)}
                </div>
                <CustomSelect
                    options={chatIdOptions}
                    value={chatIdSource}
                    onChange={handleChatIdSourceChange}
                    placeholder="Select Chat ID source"
                />
                
                {chatIdSource === 'custom' && (
                  <div className="relative mt-2">
                    <input
                      type={field.type}
                      value={credentials[field.key] || ""}
                      onChange={(e) => handleDataMappingChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2 bg-[#2a2e3f] border border-[#3a3f52] rounded-md text-white focus:outline-none focus:border-[#6d3be4] pr-10"
                    />
                  </div>
                )}
              </div>
            );
          }

          if (field.type === 'select') {
            const fieldOptionsWithIcon: ActionOption[] = field.options.map(option => ({
                ...option,
                icon: List,
            }));
            
            return (
              <div className="flex flex-col gap-2" key={field.key}>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-[#c5c5d2]">{field.label}</label>
                  {field.required && (<span className="bg-red-500/20 text-red-400 text-xs px-1.5 py-0.5 rounded-full">*</span>)}
                </div>
                <CustomSelect
                  options={fieldOptionsWithIcon}
                  value={credentials[field.key] || ""}
                  onChange={(value) => handleDataMappingChange(field.key, value)}
                  placeholder={field.placeholder || "Select an option"}
                />
                {field.description && (<p className="text-xs text-[#9b9bab] mt-1">{field.description}</p>)}
              </div>
            );
          }
          
          return (
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
                    onPillTrigger={(el) => handlePillTrigger(field.key, el)}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 bg-[#2a2e3f] border border-[#3a3f52] rounded-md text-white focus:outline-none focus:border-[#6d3be4] pr-10"
                    lastInsertedPill={lastInsertedPill}
                    setLastInsertedPill={setLastInsertedPill}
                    availableDataSources={availableDataSources}
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
          );
        })}
      </div>

      {customMessageFields.map((field: InputField) => {
        // ... (no changes in this block)
        return (
          <div className="flex flex-col gap-2" key={field.key}>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-[#c5c5d2]">{field.label}</label>
              {field.allowDataMapping && (<span className="text-xs font-mono text-[#a37ff0] bg-[#6d3be4]/20 px-1.5 py-0.5 rounded-md" title="Data mapping available">$</span>)}
              {field.required && (<span className="bg-red-500/20 text-red-400 text-xs px-1.5 py-0.5 rounded-full">*</span>)}
            </div>
            <div className="relative">
              <ContentEditableWithPillsInput
                value={customMessages[field.key] || ""}
                onChange={(newValue) => handleDataMappingChange(field.key, newValue)}
                onPillTrigger={(el) => handlePillTrigger(field.key, el)}
                placeholder={field.placeholder}
                rows={4}
                className="w-full px-3 py-2 bg-[#2a2e3f] border border-[#3a3f52] rounded-md text-white focus:outline-none focus:border-[#6d3be4] resize-none pr-10"
                lastInsertedPill={lastInsertedPill}
                setLastInsertedPill={setLastInsertedPill}
                availableDataSources={availableDataSources}
              />
              {field.allowDataMapping && (<button type="button" className="absolute top-2.5 right-3 text-[#9b9bab] hover:text-white cursor-help" title="Type $ to insert datafrom a previous step."><Info className="h-4 w-4"/></button>)}
            </div>
            {field.description && (<p className="text-xs text-[#9b9bab]">{field.description}</p>)}
          </div>
        );
      })}

      {AppSpecificComponent && shouldShowBotLink && (<AppSpecificComponent {...appOutputLinkConfig.propBuilder({})} />)}
      
      {selectedAction && (
        <div className="flex flex-col gap-2 pt-3">
          <label className="text-sm font-medium text-[#c5c5d2]">Select Export Option</label>
          {exportOptions.length > 0 ? (
            <MultiSelectDropdown
              options={exportOptions}
              selectedValues={selectedExport}
              onSave={setSelectedExport}
              placeholder="Choose export value(s)"
            />
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