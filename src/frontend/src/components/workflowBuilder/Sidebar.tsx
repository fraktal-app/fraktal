import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Settings, ChevronLeft, ChevronRight, Undo2 } from "lucide-react"
import type { AppBlock } from "./types"
import { appBlocks } from "./blocks"


interface WorkflowSidebarProps {
  collapsed: boolean
  onToggleCollapse: () => void
  onDragStart: (event: React.DragEvent, app: AppBlock) => void
}

export const WorkflowSidebar: React.FC<WorkflowSidebarProps> = ({ 
  collapsed, 
  onToggleCollapse, 
  onDragStart 
}) => {
  const [activeTab, setActiveTab] = useState<"trigger" | "action">("trigger")
  const navigate = useNavigate()

  const filteredApps = appBlocks.filter((app) => app.category === activeTab || app.category === "both")

  if (collapsed) {
    return (
      <button
        onClick={onToggleCollapse}
        className="fixed left-2 top-20 z-50 p-2 bg-[#1b1f2a] border border-[#2a2e3f] text-[#9b9bab] hover:text-[#ffffff] hover:bg-[#2a2e3f] rounded-lg shadow-lg"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    )
  }

  return (
    <aside className="w-72 bg-[#1b1f2a] border-r border-[#2a2e3f] transition-all duration-300">
      <div className="p-4 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#e545a0]" />
            <h2 className="text-lg font-bold text-[#ffffff]">App Library</h2>
          </div>
          <button
            onClick={onToggleCollapse}
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

        {/* App List */}
        <div className="space-y-2 flex-1 overflow-y-auto" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {filteredApps.map((app, index) => (
            <div
              key={`${app.type}-${app.category}-${index}`}
              onDragStart={(event) => onDragStart(event, app)}
              draggable
              className="group p-3 bg-[#2a2e3f] hover:bg-[#3a3f52] rounded-xl cursor-grab select-none border border-[#3a3f52] hover:border-[#4a4f62]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg bg-white">
                  {app.iconUrl ? (
                    <img src={app.iconUrl} alt={app.label} className="w-6 h-6 object-contain" />
                  ) : (
                    <app.icon className="w-5 h-5 text-[#2a2e3f]" />
                  )}
                </div>
                <div className="flex-1">
                  <span className="text-[#ffffff] font-medium text-sm">{app.label}</span>
                  <p className="text-[#9b9bab] text-xs mt-0.5">
                    {app.category === "both" ? "Trigger & Action" : app.category === "trigger" ? "Trigger only" : "Action only"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Back Button */}
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
    </aside>
  )
}