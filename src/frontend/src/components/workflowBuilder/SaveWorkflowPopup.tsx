// components/SaveWorkflowPopup.tsx
import { AlertCircle } from "lucide-react"

interface SaveWorkflowPopupProps {
  showSavePopup: boolean
  workflowName: string
  setWorkflowName: (name: string) => void
  validationError: string
  handlePopupSave: () => void
  handlePopupCancel: () => void
}

export function SaveWorkflowPopup({
  showSavePopup,
  workflowName,
  setWorkflowName,
  validationError,
  handlePopupSave,
  handlePopupCancel
}: SaveWorkflowPopupProps) {
  if (!showSavePopup) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1b1f2a] border border-[#2a2e3f] rounded-lg p-6 w-96 max-w-md">
        <h2 className="text-lg font-bold text-[#ffffff] mb-4">Save Workflow</h2>
        
        {/* Show validation error in popup if any */}
        {validationError && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-sm">{validationError}</span>
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#9b9bab] mb-2">
            Workflow Name
          </label>
          <input
            type="text"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="w-full bg-[#0d0f1c] border border-[#3a3f52] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6d3be4] focus:border-transparent"
            placeholder="Enter workflow name"
            autoFocus
          />
        </div>
        
        <div className="flex justify-end gap-3">
          <button
            onClick={handlePopupCancel}
            className="px-4 py-2 text-[#9b9bab] hover:text-[#ffffff] hover:bg-[#2a2e3f] rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handlePopupSave}
            disabled={!!validationError}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              validationError
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-[#6d3be4] hover:bg-[#5a2fc7] text-white"
            }`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  )
}