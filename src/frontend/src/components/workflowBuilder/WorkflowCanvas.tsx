import { Plus } from "lucide-react"
import type { AppBlock, WorkflowStep as WorkflowStepType, AvailableDataSource } from "./types"
import { WorkflowStep } from "./WorkflowSteps"

import { exportEventsByAction } from "../../blocks/blocksHandler/actions/actionResponse" 
import { exportEventsByApp } from "../../blocks/blocksHandler/triggers/triggerEvents"
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
  userId: string
  workflowId: string
}

interface ConfiguredWorkflowStep extends WorkflowStepType {
    app: AppBlock;
    configData: {
        event: string;
        export: string;
        [key: string]: any;
    };
}

function isStepConfigured(step: WorkflowStepType): step is ConfiguredWorkflowStep {
   return !!(step.app && step.configData && step.configData.event && step.configData.export);
}

const triggerExportEvents = {
 ...exportEventsByApp,
};

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
  userId,
  workflowId,
}: WorkflowCanvasProps) {
  return (
    <main
      className="flex-1 overflow-y-auto bg-[#0d0f1c]"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <div className="min-h-full flex items-center justify-center p-8">
        <div className="w-full max-w-2xl">
          <div className="space-y-4">
            
            {workflowSteps.map((step, index) => {
              const previousSteps = workflowSteps.slice(0, index)

              const availableDataSources: AvailableDataSource[] = previousSteps
                .filter(isStepConfigured)
                .map((prevStep, prevStepIndex, allFilteredPrevSteps) => {
                  const eventKey = prevStep.configData.event;
                  const exportKey = prevStep.configData.export; 
                  let exportLabel = exportKey; 

                  const exportOptions = prevStep.type === 'trigger'
                    ? triggerExportEvents[eventKey as keyof typeof triggerExportEvents]
                    : exportEventsByAction[eventKey as keyof typeof exportEventsByAction];

                  if (exportOptions && Array.isArray(exportOptions)) {
                    const selectedOption = exportOptions.find(opt => opt.value === exportKey);
                    if (selectedOption) {
                      exportLabel = selectedOption.label;
                    }
                  }
                  
                  const exportData = {
                    [exportKey]: { label: exportLabel }
                  };

                  let typeIndex = 0;
                  if (prevStep.type === 'action') {
                      const previousActions = allFilteredPrevSteps
                          .slice(0, prevStepIndex)
                          .filter(s => s.type === 'action');
                      typeIndex = previousActions.length;
                  }

                  return {
                    id: prevStep.id, // ✅ FIXED: Added the missing 'id' property.
                    stepNumber: prevStep.stepNumber,
                    stepLabel: prevStep.app.label,
                    data: exportData,
                    appType: prevStep.app.type,
                    stepType: prevStep.type,
                    typeIndex: typeIndex,
                  }
                })

              return (
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
                  userId={userId}
                  workflowId={workflowId}
                  availableDataSources={availableDataSources}
                />
              )
            })}

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