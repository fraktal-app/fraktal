//zapeditor
import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getUserData } from "../lib/userAuth"
import { useParams } from 'react-router-dom';

import {
  Mail,
  MessageSquare,
  Send,
  FileText,
  Github,
  Webhook,
  TrendingUp,
  Save,
  ChevronLeft,
  ChevronRight,
  Plus,
  Play,
  Settings,
  X,
  ArrowDown,
  Undo2,
  Coins,
} from "lucide-react"

import discord from "../assets/discord.png"
import github from "../assets/github.png"
import gmail from "../assets/gmail.png"
import metamask from "../assets/metamask.png"
import notion from "../assets/notion.png"
import telegram from "../assets/telegram.png"
import etherium from "../assets/eth.png"

import TriggerDropdown from "../components/TriggerDropdown"
import ActionDropdown from "../components/ActionDropdown";

interface AppBlock {
  type: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  iconUrl?: string
  color: string
  category: "trigger" | "action" | "both"
}

interface WorkflowStep {
  id: string
  type: "trigger" | "action"
  app?: AppBlock
  stepNumber: number
  configData?: {
    event: string
    clientId?: string
    clientPassword?: string
    export: string
  }
  showDropdown?: boolean
}

const appBlocks: AppBlock[] = [
  { type: "gmail", label: "Gmail", icon: Mail, iconUrl: gmail, color: "white", category: "trigger" },
  { type: "discord", label: "Discord", icon: MessageSquare, iconUrl: discord, color: "white", category: "trigger" },
  { type: "telegram", label: "Telegram", icon: Send, iconUrl: telegram, color: "white", category: "trigger" },
  { type: "github", label: "GitHub", icon: Github, iconUrl: github, color: "white", category: "trigger" },
  { type: "wallet-tracking", label: "Wallet Tracking", icon: TrendingUp, iconUrl: metamask, color: "white", category: "trigger"},
  { type: "token-price", label: "Token Price", icon: Coins , iconUrl: etherium, color: "white", category: "trigger" },
  { type: "discord-send",label: "Discord",icon: MessageSquare,iconUrl: discord,color: "white",category: "action"},
  { type: "notion-create",label: "Notion",icon: FileText,iconUrl: notion,color: "white",category: "action"},
  { type: "telegram-send",label: "Telegram",icon: Send,iconUrl: telegram,color: "white",category: "action",},
  { type: "webhook-post", label: "Post to Webhook", icon: Webhook, color: "white", category: "action" },
  { type: "gmail-send",label: "Gmail",icon: Mail,iconUrl: gmail,color: "white",category: "action",}
]

export default function WorkflowBuilder() {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const navigate = useNavigate()
  const { workflowId } = useParams();
  console.log('Workflow ID:', workflowId);
  
  const actionDropdownOptions: Record<string, string[]> = {
    gmail: ["Send Gmail notification", "Archive Email", "Mark as Read"],
    discord: ["Send message", "Send alert", "Create channel"],
    telegram: ["Send message", "Pin message"],
    notion: ["Create page", "Log database"],
    webhook: ["Send custom payload", "Trigger external service", "Forward data"]
  }

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState<"trigger" | "action">("trigger")
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([
    { id: "trigger-1", type: "trigger", stepNumber: 1 },
    { id: "action-1", type: "action", stepNumber: 2 },
  ])
  const [draggedApp, setDraggedApp] = useState<AppBlock | null>(null)
  const [showSavePopup, setShowSavePopup] = useState(false)
  const [workflowName, setWorkflowName] = useState("Untitled")

  async function manageUserSession() {
    const currentUserData = await getUserData()
    if (currentUserData) {
      setIsLoading(false)
    } else {
      navigate('/login')
    }
  }

  useEffect(() => {
    manageUserSession()
  }, [])

  const onDragStart = (event: React.DragEvent, app: AppBlock) => {
    setDraggedApp(app)
    event.dataTransfer.effectAllowed = "move"
  }

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }

  const onDrop = (event: React.DragEvent, stepId: string) => {
    event.preventDefault()
    if (!draggedApp) return

    const step = workflowSteps.find((s) => s.id === stepId)
    if (!step) return
    const isCompatible =
      draggedApp.category === "both" ||
      (draggedApp.category === "trigger" && step.type === "trigger") ||
      (draggedApp.category === "action" && step.type === "action")

    if (!isCompatible) {
      console.log(`Cannot drop ${draggedApp.label} (${draggedApp.category}) on ${step.type} step`)
      setDraggedApp(null)
      return
    }

    setWorkflowSteps((prev) =>
      prev.map((step) =>
        step.id === stepId ? { ...step, app: draggedApp, showDropdown: true } : { ...step, showDropdown: false },
      ),
    )

    setDraggedApp(null)
  }

  const addActionStep = () => {
    const newStep: WorkflowStep = {
      id: `action-${Date.now()}`,
      type: "action",
      stepNumber: workflowSteps.length + 1,
    }
    setWorkflowSteps((prev) => [...prev, newStep])
  }

  const removeStep = (stepId: string) => {
    if (workflowSteps.length <= 2) return

    setWorkflowSteps((prev) => prev.filter((step) => step.id !== stepId))
  }

  const handleSaveConfig = (
    stepId: string,
    formData: { event: string; clientId?: string; clientPassword?: string; export: string },
  ) => {
    setWorkflowSteps((prev) =>
      prev.map((step) => (step.id === stepId ? { ...step, configData: formData, showDropdown: false } : step)),
    )
  }

  const handleCancelConfig = (stepId: string) => {
    setWorkflowSteps((prev) => prev.map((step) => (step.id === stepId ? { ...step, showDropdown: false } : step)))
  }

  const clearStep = (stepId: string) => {
    setWorkflowSteps((prev) =>
      prev.map((step) =>
        step.id === stepId ? { ...step, app: undefined, configData: undefined, showDropdown: false } : step,
      ),
    )
  }

  const handleSaveWorkflow = () => {
    const trigger = workflowSteps.find((step) => step.type === "trigger" && step.app)
    const actions = workflowSteps.filter((step) => step.type === "action" && step.app)

    const workflowData = {
      name: workflowName,
      trigger: trigger
        ? {
            id: trigger.id,
            type: trigger.type,
            appType: trigger.app?.type,
            label: trigger.app?.label,
            event: trigger.configData?.event || null,
            clientId: trigger.configData?.clientId || null,
            clientPassword: trigger.configData?.clientPassword || null,
            export: trigger.configData?.export || null,
          }
        : null,
      actions: actions.map((action) => ({
          id: action.id,
          type: action.type,
          appType: action.app?.type,
          label: action.app?.label,
          event: action.configData?.event || null,
          export: action.configData?.export || null,
          credentials: Object.fromEntries(
            Object.entries(action.configData || {}).filter(
              ([key]) => !["event", "export"].includes(key)
            )
          ),
        })),
    }

    console.log("Workflow Name:", workflowData.name)
    console.log("client id:", workflowData.trigger?.clientId)
    console.log("client password:", workflowData.trigger?.clientPassword)
    console.log("trigger app:", workflowData.trigger?.label)
    console.log("trigger event:", workflowData.trigger?.event)
    console.log("export:", workflowData.trigger?.export)
    console.log(
      "All Actions:",
      workflowData.actions.map((action) => action.label),
    )
    console.log("Full Workflow JSON:", workflowData)

    // Here you would typically send the workflow data to your backend
    // For now, we'll just close the popup
    setShowSavePopup(false)
    
    // You can add success notification here
    alert(`Workflow "${workflowName}" saved successfully!`)
  }

  const handleSaveButtonClick = () => {
    setShowSavePopup(true)
  }

  const handlePopupSave = () => {
    handleSaveWorkflow()
  }

  const handlePopupCancel = () => {
    setShowSavePopup(false)
  }

  const filteredApps = appBlocks.filter((app) => app.category === activeTab || app.category === "both")

  // Find the trigger step with an app assigned
  const trigger = workflowSteps.find((step) => step.type === "trigger" && step.app)

  // Loading state
  if (isLoading) {
    return (
      <div className="h-screen bg-[#0d0f1c] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6d3be4] mx-auto mb-4"></div>
          <h1 className="text-xl font-semibold text-[#ffffff]">Loading...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-[#0d0f1c] text-white flex flex-col">
      <header className="h-16 bg-[#1b1f2a] border-b border-[#2a2e3f] px-6 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-[#ffffff] tracking-tight">Workflow Editor</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveButtonClick}
            className="flex items-center gap-2 px-4 py-2 border border-white text-white hover:bg-white hover:text-black rounded-lg font-medium transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Workflow
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-white text-white hover:bg-white hover:text-black rounded-lg font-medium transition-colors">
            <Play className="w-4 h-4" />
            Run
          </button>
        </div>
      </header>

      {/* Save Workflow Popup */}
      {showSavePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1b1f2a] border border-[#2a2e3f] rounded-lg p-6 w-96 max-w-md">
            <h2 className="text-lg font-bold text-[#ffffff] mb-4">Save Workflow</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#9b9bab] mb-2">
                Workflow Name
              </label>
              <input
                type="text"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                className="w-full bg-[#0d0f1c] border border-[#3a3f52] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6d3be4] focus:border-transparent"
                placeholder="Enter workflow name"
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={handlePopupCancel}
                className="px-4 py-2 text-[#9b9bab] hover:text-[#ffffff] hover:bg-[#2a2e3f] rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePopupSave}
                className="px-4 py-2 bg-[#6d3be4] hover:bg-[#5a2fc7] text-white rounded-lg font-medium transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <aside
  className={`${sidebarCollapsed ? "w-0" : "w-72"} bg-[#1b1f2a] border-r border-[#2a2e3f] transition-all duration-300 overflow-hidden`}
>
  {!sidebarCollapsed && (
    <div className="p-4 h-full flex flex-col">
      {/* Header wala part*/}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#e545a0]" />
          <h2 className="text-lg font-bold text-[#ffffff]">App Library</h2>
        </div>
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-2 text-[#9b9bab] hover:text-[#ffffff] hover:bg-[#2a2e3f] rounded-lg"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex mb-4 bg-[#2a2e3f] rounded-lg p-1">
        <button
          onClick={() => setActiveTab("trigger")}
          className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all ${
            activeTab === "trigger"
              ? "bg-[#6d3be4] text-white shadow-sm"
              : "text-[#9b9bab] hover:text-[#ffffff]"
          }`}
        >
          Triggers
        </button>
        <button
          onClick={() => setActiveTab("action")}
          className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all ${
            activeTab === "action" 
              ? "bg-[#6d3be4] text-white shadow-sm" 
              : "text-[#9b9bab] hover:text-[#ffffff]"
          }`}
        >
          Actions
        </button>
      </div>

      <div
        className="space-y-2 flex-1 overflow-y-auto"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {filteredApps.map((app, index) => {
          return (
            <div
              key={`${app.type}-${app.category}-${index}`}
              onDragStart={(event) => onDragStart(event, app)}
              draggable
              className="group p-3 bg-[#2a2e3f] hover:bg-[#3a3f52] rounded-xl cursor-grab select-none border border-[#3a3f52] hover:border-[#4a4f62]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg bg-white">
                  {app.iconUrl ? (
                    <img
                      src={app.iconUrl || "/placeholder.svg"}
                      alt={app.label}
                      className="w-6 h-6 object-contain"
                    />
                  ) : (
                    <app.icon className="w-5 h-5 text-[#2a2e3f]" />
                  )}
                </div>
                <div className="flex-1">
                  <span className="text-[#ffffff] font-medium text-sm">{app.label}</span>
                  <p className="text-[#9b9bab] text-xs mt-0.5">
                    {app.category === "both"
                      ? "Trigger & Action"
                      : app.category === "trigger"
                      ? "Trigger only"
                      : "Action only"}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="border-t border-[#2a2e3f] pt-4 mt-4">
        <button
          className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#2a2e3f] transition-colors text-[#9b9bab] hover:text-[#ffffff] w-full"
          onClick={() => navigate('/dashboard')}
        >
          <Undo2 className="w-5 h-5 shrink-0" />
          <span>Back</span>
        </button>
      </div>
    </div>
  )}
</aside>
        
        {sidebarCollapsed && (
          <button
            onClick={() => setSidebarCollapsed(false)}
            className="fixed left-2 top-20 z-50 p-2 bg-[#1b1f2a] border border-[#2a2e3f] text-[#9b9bab] hover:text-[#ffffff] hover:bg-[#2a2e3f] rounded-lg shadow-lg"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        <main
          className="flex-1 overflow-y-auto bg-[#0d0f1c]"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <div className="min-h-full flex items-center justify-center p-8">
            <div className="w-full max-w-2xl">
              <div className="space-y-4">
                {workflowSteps.map((step, index) => (
                  <div key={step.id} className="relative">
                    <div
                      className={`relative border-2 border-dashed rounded-xl p-3 transition-all duration-200 ${
                        step.app
                          ? "border-[#3a3f52] bg-[#1b1f2a]"
                          : "border-[#2a2e3f] bg-[#1b1f2a]/50 hover:border-[#3a3f52] hover:bg-[#1b1f2a]"
                      } ${
                        draggedApp && (draggedApp.category !== "both" && draggedApp.category !== step.type)
                          ? "border-red-500/50 bg-red-500/10"
                          : ""
                      }`}
                      onDragOver={onDragOver}
                      onDrop={(e) => onDrop(e, step.id)}
                    >
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-base font-bold text-[#ffffff] capitalize">{step.type}</h3>
                        {step.app && step.type === "action" && workflowSteps.length > 2 && (
                          <button
                            onClick={() => removeStep(step.id)}
                            className="ml-auto p-1 text-[#9b9bab] hover:text-[#ff4f5e]"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {step.app ? (
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-lg">
                              {step.app.iconUrl ? (
                                <img
                                  src={step.app.iconUrl || "/placeholder.svg"}
                                  alt={step.app.label}
                                  className="w-5 h-5 object-contain"
                                />
                              ) : (
                                <step.app.icon className="w-4 h-4 text-[#2a2e3f]" />
                              )}
                            </div>

                            <div className="flex-1">
                              <h4 className="text-[#ffffff] font-medium">{step.app.label}</h4>
                              <p className="text-[#c5c5d2] text-sm">
                                {step.configData?.event
                                  ? `Configured: ${step.configData.event}`
                                  : step.type === "trigger"
                                  ? "When this happens..."
                                  : "Do this..."}
                              </p>
                            </div>

                            <button
                              onClick={() => clearStep(step.id)}
                              className="p-2 text-[#9b9bab] hover:text-[#ffffff] hover:bg-[#2a2e3f] rounded-lg"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          {step.type === "action" && !step.showDropdown && step.configData?.event && (
                          <div className="mt-2 p-2 bg-[#2a2e3f] rounded-lg">
                            <p className="text-sm text-[#9b9bab]">
                              Action: <span className="text-[#ffffff]">{step.configData.event}</span>
                            </p>
                            <button
                              onClick={() => setWorkflowSteps(prev => 
                                prev.map(s => s.id === step.id ? {...s, showDropdown: true} : s)
                              )}
                              className="mt-2 text-xs text-[#6d3be4] hover:text-[#5a2fc7] underline"
                            >
                              Edit Configuration
                            </button>
                          </div>
                        )}

{step.type === "action" && !step.configData?.event && (
  <div className="mt-2">
    <button
      onClick={() => setWorkflowSteps(prev => 
        prev.map(s => s.id === step.id ? {...s, showDropdown: true} : s)
      )}
      className="w-full px-3 py-2 bg-[#2a2e3f] border border-[#3a3f52] text-[#9b9bab] rounded-lg hover:bg-[#3a3f52] text-sm"
    >
      Configure Action
    </button>
  </div>
)}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <h4 className="text-[#ffffff] font-medium mb-1 text-sm">
                            {step.stepNumber}. Select the{" "}
                            {step.type === "trigger" ? "event that starts your Zap" : "event for your Zap to run"}
                          </h4>
                          <p className="text-[#9b9bab] text-xs">Drag a {step.type} app from the sidebar</p>
                        </div>
                      )}

                      {step.showDropdown && step.type === "trigger" && (
                        <TriggerDropdown
                          isOpen={step.showDropdown as boolean}
                          onSave={(formData: { event: string; clientId?: string; clientPassword?: string; export: string }) =>
                            handleSaveConfig(step.id, formData)
                          }
                          onCancel={() => handleCancelConfig(step.id)}
                          appType={step.app?.type}
                        />
                      )}
                      {step.showDropdown && step.type === "action" && (
                        <ActionDropdown
                          isOpen={step.showDropdown as boolean}
                          onSave={(formData: { [key: string]: string }) =>
                            handleSaveConfig(step.id, { 
                              ...step.configData, 
                              ...formData, 
                              event: formData.event ?? "", 
                              export: formData.export ?? "" 
                            })
                          }
                          onCancel={() => handleCancelConfig(step.id)}
                          appType={step.app?.type}
                        />
                      )}
                    </div>

                    {index < workflowSteps.length - 1 && (
                      <div className="flex flex-col items-center py-2">
                        <div className="w-px h-4 bg-[#6d3be4]"></div>
                        <div className="w-6 h-6 bg-[#6d3be4] rounded-full flex items-center justify-center">
                          <ArrowDown className="w-4 h-4 text-white" />
                        </div>
                        <div className="w-px h-4 bg-[#6d3be4]"></div>
                      </div>
                    )}
                  </div>
                ))}

                <div className="flex justify-center pt-4">
                  <button
                    onClick={addActionStep}
                    className="flex items-center gap-2 px-6 py-3 bg-[#6d3be4] hover:bg-[#5a2fc7] rounded-xl font-medium text-[#ffffff] shadow-lg"
                  >
                    <Plus className="w-5 h-5" />
                    Add Action
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}