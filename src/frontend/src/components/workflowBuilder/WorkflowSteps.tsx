import { X, ArrowDown } from "lucide-react"
import TriggerDropdown from "../../blocks/blocksHandler/triggers/Triggers"
import ActionDropdown from "../../blocks/blocksHandler/actions/Actions"
import type { WorkflowStep as WorkflowStepType, AvailableDataSource } from "./types";

interface WorkflowStepProps {
  step: WorkflowStepType
  index: number
  totalSteps: number
  draggedApp: any
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent, stepId: string) => void
  onRemoveStep: (stepId: string) => void
  onClearStep: (stepId: string) => void
  onSaveConfig: (stepId: string, formData: any) => void
  onCancelConfig: (stepId: string) => void
  onShowDropdown: (stepId: string) => void
  userId: string
  workflowId: string
  availableDataSources: AvailableDataSource[];
}

export function WorkflowStep({
  step,
  index,
  totalSteps,
  draggedApp,
  onDragOver,
  onDrop,
  onRemoveStep,
  onClearStep,
  onSaveConfig,
  onCancelConfig,
  onShowDropdown,
  userId,
  workflowId,
  availableDataSources,
}: WorkflowStepProps) {
  return (
    <div className="relative">
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
          {step.app && step.type === "action" && totalSteps > 2 && (
            <button
              onClick={() => onRemoveStep(step.id)}
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
                    }
                </p>
              </div>

              <button
                onClick={() => onClearStep(step.id)}
                className="p-2 text-[#9b9bab] hover:text-[#ffffff] hover:bg-[#2a2e3f] rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {!step.showDropdown && (
              <div className="mt-2 p-2 bg-[#2a2e3f] rounded-lg">
                <button
                  onClick={() => onShowDropdown(step.id)}
                  className="mt-2 text-xs text-[#6d3be4] hover:text-[#5a2fc7] no-underline"
                >
                  {step.configData?.event ? "Edit Configuration" : "Add Configuration"}
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
            onSave={(formData: { [key: string]: any }) =>
              onSaveConfig(step.id, formData)
            }
            onCancel={() => onCancelConfig(step.id)}
            appType={step.app?.type}
            userId={userId}
            workflowId={workflowId}
            initialData={step.configData}
          />
        )}
        {step.showDropdown && step.type === "action" && (
          <ActionDropdown
            isOpen={step.showDropdown as boolean}
            onSave={(formData: { [key: string]: any }) => {
              onSaveConfig(step.id, formData);
            }}
            onCancel={() => onCancelConfig(step.id)}
            appType={step.app?.type}
            userId={userId}
            workflowId={workflowId}
            initialData={step.configData}
            availableDataSources={availableDataSources}
          />
        )}
      </div>

      {index < totalSteps - 1 && (
        <div className="flex flex-col items-center py-2">
          <div className="w-px h-4 bg-[#6d3be4]"></div>
          <div className="w-6 h-6 bg-[#6d3be4] rounded-full flex items-center justify-center">
            <ArrowDown className="w-4 h-4 text-white" />
          </div>
          <div className="w-px h-4 bg-[#6d3be4]"></div>
        </div>
      )}
    </div>
  )
}
