import type React from "react"

export interface AppBlock {
  type: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  iconUrl?: string
  color: string
  category: "trigger" | "action" | "both"
}

export interface WorkflowStep {
  id: string
  type: "trigger" | "action"
  app?: AppBlock
  stepNumber: number
   configData?: {
    event: string
    export: any
    [key: string]: any
  }
  showDropdown?: boolean
}

export interface WorkflowData {
  name: string
  trigger: TriggerData | null
  actions: ActionData[]
}

export interface TriggerData {
  id: string
  type: string
  appType?: string
  label?: string
  event: string | null
  export: any | null
  clientId?: string
  clientPassword?: string
  credentials: Record<string, any>
}

export interface ActionData {
  id: string
  type: string
  appType?: string
  label?: string
  event: string | null
  export: any | null
  credentials?: Record<string, any>
}
export interface AvailableDataSource {
  stepNumber: number;
  stepLabel: string;
  data: any;
  appType: string;
}
