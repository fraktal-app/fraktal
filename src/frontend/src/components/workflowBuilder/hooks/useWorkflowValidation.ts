import type { WorkflowStep } from "../types"

export const useWorkflowValidation = () => {
  const validateWorkflow = (workflowSteps: WorkflowStep[]): string => {
    const configuredTrigger = workflowSteps.find(
      step => step.type === "trigger" && step.app && step.configData?.event
    )
    const configuredActions = workflowSteps.filter(
      step => step.type === "action" && step.app && step.configData?.event
    )

    if (!configuredTrigger) {
      return "Please configure at least one trigger to save the workflow."
    }
    if (configuredActions.length === 0) {
      return "Please configure at least one action to save the workflow."
    }
    return ""
  }

  return { validateWorkflow }
}