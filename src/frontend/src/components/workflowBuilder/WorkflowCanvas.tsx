// components/workflowBuilder/WorkflowCanvas.tsx
import { Plus } from "lucide-react"
import type { WorkflowStep as WorkflowStepType } from "./types"
import { WorkflowStep } from "./WorkflowSteps"

interface WorkflowCanvasProps {
  workflowSteps: WorkflowStepType[]
  draggedApp: any
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent, stepId: string) => void
  onAddActionStep: () => void
  onRemoveStep: (stepId: string) => void
  onClearStep: (stepId: string) => void
  onSaveConfig: (stepId: string, formData: any) => void
  onCancelConfig: (stepId: string) => void
  onShowDropdown: (stepId: string) => void
}

export function WorkflowCanvas({
  workflowSteps,
  draggedApp,
  onDragOver,
  onDrop,
  onAddActionStep,
  onRemoveStep,
  onClearStep,
  onSaveConfig,
  onCancelConfig,
  onShowDropdown,
}: WorkflowCanvasProps) {
  return (
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
              <WorkflowStep
                key={step.id}
                step={step}
                index={index}
                totalSteps={workflowSteps.length}
                draggedApp={draggedApp}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onRemoveStep={onRemoveStep}
                onClearStep={onClearStep}
                onSaveConfig={onSaveConfig}
                onCancelConfig={onCancelConfig}
                onShowDropdown={onShowDropdown}
              />
            ))}

            <div className="flex justify-center pt-4">
              <button
                onClick={onAddActionStep}
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
  )
}