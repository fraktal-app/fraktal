// hooks/useWorkflowHandlers.ts
import { useState } from "react"
import { toast } from "react-toastify"
import type { WorkflowStep } from "../types"
import DOMPurify from "dompurify";

async function saveWorkflowToDB(workflowData: any, userId: string, workflowId: string){
  try{
    const baseURL = `${window.location.protocol}//${window.location.host}`;

    await fetch(baseURL + "/save-workflow", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: workflowId,
        user_id: userId,
        title: workflowData.name,
        json: JSON.stringify(workflowData)
      })
    });

  }
  catch(e){
    alert(e)
  }
}

export function useWorkflowHandlers(
  workflowSteps: WorkflowStep[],
  setWorkflowSteps: React.Dispatch<React.SetStateAction<WorkflowStep[]>>,
  workflowName: string
) {
  const [showSavePopup, setShowSavePopup] = useState(false)
  const [validationError, setValidationError] = useState<string>("")

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

  const handleShowDropdown = (stepId: string) => {
    setWorkflowSteps(prev => 
      prev.map(s => s.id === stepId ? {...s, showDropdown: true} : s)
    )
  }

  const handleSaveWorkflow = (userId: string, workflowId: string) => {
    const trigger = workflowSteps.find((step) => step.type === "trigger" && step.app)
    const actions = workflowSteps.filter((step) => step.type === "action" && step.app)

    const triggerData = trigger
      ? {
          id: trigger.id,
          type: trigger.type,
          appType: trigger.app?.type,
          label: trigger.app?.label,
          event: trigger.configData?.event || null,
          export: trigger.configData?.export || null,
          ...(trigger.configData?.clientId?.trim()
            ? { clientId: trigger.configData.clientId.trim() }
            : {}),
          ...(trigger.configData?.clientPassword?.trim()
            ? { clientPassword: trigger.configData.clientPassword.trim() }
            : {}),
          credentials: Object.fromEntries(
            Object.entries(trigger.configData || {}).filter(
              ([key, value]) =>
                !["event", "export", "clientId", "clientPassword"].includes(key) &&
                value !== null &&
                value !== ""
            )
          )
        }
      : null

    const workflowData = {
      name: workflowName,
      trigger: triggerData,
      actions: actions.map((action) => {
        let credentials = Object.fromEntries(
          Object.entries(action.configData || {}).filter(
            ([key, value]) =>
              !["event", "export"].includes(key) &&
              value !== null &&
              value !== ""
          )
        );

        // Sanitize the html field, if present
        if (typeof credentials.html === "string") {
          credentials = {
            ...credentials,
            html: DOMPurify.sanitize(credentials.html)
          };
        }

        return {
          id: action.id,
          type: action.type,
          appType: action.app?.type,
          label: action.app?.label,
          event: action.configData?.event || null,
          export: action.configData?.export || null,
          ...(Object.keys(credentials).length > 0 && { credentials }),
        };
}),

    }

    console.log("Workflow Name:", workflowData.name)
    console.log("Trigger App:", workflowData.trigger?.label)
    console.log("Trigger Event:", workflowData.trigger?.event)
    console.log("Export:", workflowData.trigger?.export)

    if (workflowData.trigger && "clientId" in workflowData.trigger) {
      console.log("Client ID:", workflowData.trigger.clientId)
    }
    if (workflowData.trigger && "clientPassword" in workflowData.trigger) {
      console.log("Client Password:", workflowData.trigger.clientPassword)
    }

    console.log("All Actions with Exports:", workflowData.actions)
    workflowData.actions.forEach((action, index) => {
      console.log(`--- Action ${index + 1} (${action.label}) ---`)
      console.log("Event:", action.event)
      console.log("Export:", action.export)

      if (action.credentials) {
        Object.entries(action.credentials).forEach(([key, value]) => {
          console.log(`${key}:`, value)
        })
      } else {
        console.log("No credentials provided.")
      }
    })

    console.log("Full Workflow JSON:", workflowData)

    saveWorkflowToDB(workflowData, userId, workflowId);

    setShowSavePopup(false)
    setValidationError("")

    toast.success(`Workflow "${workflowName}" saved successfully!`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
  }

  return {
    showSavePopup,
    setShowSavePopup,
    validationError,
    setValidationError,
    addActionStep,
    removeStep,
    handleSaveConfig,
    handleCancelConfig,
    clearStep,
    handleShowDropdown,
    handleSaveWorkflow,
  }
}