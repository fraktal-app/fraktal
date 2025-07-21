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
    setWorkflowSteps((prevSteps) => {
      const actionSteps = prevSteps.filter(step => step.type === 'action');
      
      const maxActionIndex = actionSteps.reduce((maxIndex, step) => {
        const parts = step.id.split('-');
        const index = parseInt(parts[parts.length - 1], 10);
        
        if (!isNaN(index) && index > maxIndex) {
          return index;
        }
        return maxIndex;
      }, 0);

      const newId = `action-${maxActionIndex + 1}`;

      const newStep: WorkflowStep = {
        id: newId,
        type: "action",
        stepNumber: prevSteps.length + 1,
      };
      return [...prevSteps, newStep];
    });
  };

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

    const actionsData = actions.map((action) => {
      let credentials = Object.fromEntries(
        Object.entries(action.configData || {}).filter(
          ([key, value]) =>
            !["event", "export"].includes(key) &&
            value !== null &&
            value !== ""
        )
      );

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
    });

    const variables: string[] = [];
    const pillRegex = /\$\?\{[^}]+\}/g;
    const allStepsData = [triggerData, ...actionsData].filter(Boolean);

    allStepsData.forEach(step => {
      if (step && step.credentials) {
        Object.values(step.credentials).forEach(value => {
          let textToScan = '';
          if (typeof value === 'string') {
            textToScan = value;
          } else if (typeof value === 'object' && value !== null && (value as any).text) {
            textToScan = (value as any).text;
          }

          const matches = textToScan.match(pillRegex);
          if (matches) {
            variables.push(...matches);
          }
        });
      }
    });
    
    const workflowData = {
      name: workflowName,
      trigger: triggerData,
      actions: actionsData,
      variables: variables, 
    };

    console.log("Full Workflow JSON:", workflowData);

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