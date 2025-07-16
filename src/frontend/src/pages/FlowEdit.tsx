//zapeditor
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getUserData } from "../lib/userAuth"
import { useParams } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { WorkflowHeader } from "../components/workflowBuilder/Header";
import type { WorkflowStep } from "../components/workflowBuilder/types";
import { useWorkflowValidation } from "../components/workflowBuilder/hooks/useWorkflowValidation";
import { WorkflowSidebar } from "../components/workflowBuilder/Sidebar";
import { SaveWorkflowPopup } from "../components/workflowBuilder/SaveWorkflowPopup";
import { ValidationErrorBanner } from "../components/workflowBuilder/ValidationErrorBanner";
import { useWorkflowDragDrop } from "../components/workflowBuilder/hooks/useWorkflowDragDrop";
import { WorkflowCanvas } from "../components/workflowBuilder/WorkflowCanvas";
import { useWorkflowHandlers } from "../components/workflowBuilder/hooks/useWorkflowhandlers";
import { appBlocks } from "../components/workflowBuilder/blocks";

export default function WorkflowBuilder() {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const navigate = useNavigate()
  const { workflowId } = useParams();
  const [userId, setUserId] = useState<string>("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [workflowName, setWorkflowName] = useState("Untitled")
//   useEffect(() => {
//   if (workflowId) {
//     localStorage.setItem("workflowId", workflowId);
//   }
// }, [workflowId]);
console.log('Workflow ID:', workflowId);
console.log('User ID:', userId);
// const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([
//     { id: "trigger-1", type: "trigger", stepNumber: 1 },
//     { id: "action-1", type: "action", stepNumber: 2 },
//   ])
 const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([])
  const { draggedApp, onDragStart, onDragOver, onDrop } = useWorkflowDragDrop(workflowSteps, setWorkflowSteps) 
  const { validateWorkflow } = useWorkflowValidation()
  const {
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
  } = useWorkflowHandlers(workflowSteps, setWorkflowSteps, workflowName)

  async function manageUserSession() {
    const currentUserData = await getUserData()
    if (currentUserData) {
      setUserId(currentUserData.id); 
      setIsLoading(false)
    } else {
      navigate('/login')
    }
  }

  useEffect(() => {
    manageUserSession()
  }, [])
//
   useEffect(() => {
        const initializeWorkflow = async () => {
            setIsLoading(true)

            const currentUserData = await getUserData()
            if (!currentUserData) {
                navigate('/login')
                return
            }
            setUserId(currentUserData.id)

            // If a workflowId exists, load its data
            if (workflowId === 'a1b2c3d4-e5f6-7890-1234-567890abcdef') {
                localStorage.setItem("workflowId", workflowId);
                const data = {
                    "name": "My Telegram Workflow",
                    "trigger": { "id": "trigger-1", "type": "trigger", "appType": "telegram", "label": "Telegram", "event": "new-message-telegram", "export": "messenger-detail", "credentials": { "linkName": "cdcede", "command": "/link cdcede 6923565a-8143-4376-a3e5-d24e38a43f75/ebb0c255-4f64-44a9-8b2f-61cac4769ba7" } },
                    "actions": [ { "id": "action-1", "type": "action", "appType": "telegram", "label": "Telegram", "event": "send_message", "export": "messageId", "credentials": { "botToken": "cecsaw", "chatId": "cdewvdw" } } ]
                };

                setWorkflowName(data.name)

                const steps: WorkflowStep[] = []
                let stepCounter = 1

                // Parse trigger
                if (data.trigger) {
                    const app = appBlocks.find(b => b.type === data.trigger.appType && (b.category === 'trigger' || b.category === 'both'))
                    if (app) {
                        steps.push({
                            id: data.trigger.id,
                            type: 'trigger',
                            app: app,
                            stepNumber: stepCounter++,
                            configData: {
                                event: data.trigger.event,
                                export: data.trigger.export,
                                ...data.trigger.credentials,
                            },
                            showDropdown: true,
                        })
                    }
                }

                // Parse actions
                if (data.actions) {
                    data.actions.forEach(action => {
                        const app = appBlocks.find(b => b.type === action.appType && (b.category === 'action' || b.category === 'both'))
                        if (app) {
                            steps.push({
                                id: action.id,
                                type: 'action',
                                app: app,
                                stepNumber: stepCounter++,
                                configData: {
                                    event: action.event,
                                    export: action.export,
                                    ...action.credentials,
                                },
                                showDropdown: true,
                            })
                        }
                    })
                }
                setWorkflowSteps(steps)
            } else {
                // Otherwise, set up a new, blank workflow
                localStorage.removeItem("workflowId")
                setWorkflowName("Untitled")
                setWorkflowSteps([
                    { id: "trigger-1", type: "trigger", stepNumber: 1 },
                    { id: "action-1", type: "action", stepNumber: 2 },
                ])
            }
            
            setIsLoading(false)
        }

        initializeWorkflow()
    }, [workflowId, navigate])
//

  const handleSaveButtonClick = () => {
    const error = validateWorkflow(workflowSteps)
    if (error) {
      setValidationError(error)
      return
    }
    setValidationError("")
    setShowSavePopup(true)
  }

  const handlePopupSave = () => {
    const error = validateWorkflow(workflowSteps)
    if (error) {
      setValidationError(error)
      return
    }
    handleSaveWorkflow()
  }

  const handlePopupCancel = () => {
    setShowSavePopup(false)
    setValidationError("")
  }


  const isWorkflowValid = validateWorkflow(workflowSteps) === ""

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
      <WorkflowHeader 
        onSave={handleSaveButtonClick}
        onRun={() => {}}
        isWorkflowValid={isWorkflowValid}
      />

      <ValidationErrorBanner 
        validationError={validationError}
      />

      <SaveWorkflowPopup
        showSavePopup={showSavePopup}
        workflowName={workflowName}
        setWorkflowName={setWorkflowName}
        validationError={validationError}
        handlePopupSave={handlePopupSave}
        handlePopupCancel={handlePopupCancel}
      />

      <div className="flex flex-1 overflow-hidden">
        <WorkflowSidebar 
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          onDragStart={onDragStart}
        />

         <WorkflowCanvas
          workflowSteps={workflowSteps}
          draggedApp={draggedApp}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onAddActionStep={addActionStep}
          onRemoveStep={removeStep}
          onClearStep={clearStep}
          onSaveConfig={handleSaveConfig}
          onCancelConfig={handleCancelConfig}
          onShowDropdown={handleShowDropdown}
          userId={userId}
          workflowId={workflowId || ""}
        />
      </div>
      
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        style={{ top: '80px' }}
      />
    </div>
  )
}