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

export default function WorkflowBuilder() {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const navigate = useNavigate()
  const { workflowId } = useParams();
  useEffect(() => {
  if (workflowId) {
    localStorage.setItem("workflowId", workflowId);
  }
}, [workflowId]);
  const workID=workflowId;
  console.log('Workflow ID:', workflowId);
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [workflowName, setWorkflowName] = useState("Untitled")
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([
    { id: "trigger-1", type: "trigger", stepNumber: 1 },
    { id: "action-1", type: "action", stepNumber: 2 },
  ])
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
      setIsLoading(false)
    } else {
      navigate('/login')
    }
  }

  useEffect(() => {
    manageUserSession()
  }, [])


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


  // Check if workflow is valid for save button styling
  const isWorkflowValid = validateWorkflow(workflowSteps) === ""

  // Loading state
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