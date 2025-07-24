// hooks/useWorkflowDragDrop.ts
import { useState } from "react"
import type { AppBlock, WorkflowStep } from "../types"

export function useWorkflowDragDrop(
  workflowSteps: WorkflowStep[],
  setWorkflowSteps: React.Dispatch<React.SetStateAction<WorkflowStep[]>>
) {
  const [draggedApp, setDraggedApp] = useState<AppBlock | null>(null)

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

  return {
    draggedApp,
    onDragStart,
    onDragOver,
    onDrop
  }
}