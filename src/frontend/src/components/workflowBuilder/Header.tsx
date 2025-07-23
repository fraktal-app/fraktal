import { Save, } from "lucide-react"

interface WorkflowHeaderProps {
  onSave: () => void
  onRun: () => void
  isWorkflowValid: boolean
}

export const WorkflowHeader: React.FC<WorkflowHeaderProps> = ({ onSave, isWorkflowValid }) => {
  return (
    <header className="h-16 bg-[#1b1f2a] border-b border-[#2a2e3f] px-6 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-[#ffffff] tracking-tight">Workflow Editor</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onSave}
          disabled={!isWorkflowValid}
          className={`flex items-center gap-2 px-4 py-2 border rounded-lg font-medium transition-colors ${
            isWorkflowValid
              ? "border-white text-white hover:bg-white hover:text-black"
              : "border-gray-500 text-gray-500 cursor-not-allowed"
          }`}
        >
          <Save className="w-4 h-4" />
          Save Workflow
        </button>
        
      </div>
    </header>
  )
}