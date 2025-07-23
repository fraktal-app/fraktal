import React from 'react';
import { Trash2 } from 'lucide-react'; // Import the icon

export type WorkflowType = {
  id: string;
  user_id: string;
  title: string;
  createdAt: string;
};

interface WorkflowCardProps {
  flow: WorkflowType;
  onEdit: (workflowId: string) => void;
  onDelete: (workflowId: string) => void; // Add onDelete prop
}

const WorkflowCard: React.FC<WorkflowCardProps> = ({ flow, onEdit, onDelete }) => {
  return (
    // Add 'relative' to position the delete button
    <div className="relative bg-gray-800 rounded-xl p-5 border border-gray-700 hover:border-[#6d3be4] transition-all duration-300 shadow-md hover:shadow-xl flex flex-col justify-between">
      {/* Delete Button */}
      <button
        onClick={() => onDelete(flow.id)}
        className="absolute top-3 right-3 p-1.5 bg-red-500/10 hover:bg-red-500/20 rounded-full text-red-500 hover:text-red-400 transition-colors"
        aria-label="Delete workflow"
      >
        <Trash2 className="w-5 h-5" />
      </button>

      <div>
        {/* Add padding to the right of the title to prevent overlap with the button */}
        <h6 className="text-lg font-semibold line-clamp-3 pr-8">{flow.title}</h6>
      </div>
      <div className="flex items-center justify-between mt-6">
        <p className="text-sm text-gray-400">Created: {flow.createdAt}</p>
        <button
          onClick={() => onEdit(flow.id)}
          className="font-semibold text-[#8a5cf6] hover:text-[#a78bfa] transition"
        >
          Edit Workflow
        </button>
      </div>
    </div>
  );
};

export default WorkflowCard;