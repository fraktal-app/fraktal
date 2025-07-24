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

function getRelativeTime(isoString: string): string {
  // Ensure ISO string ends with 'Z' if not already (assumes UTC)
  if (!isoString.endsWith('Z') && !isoString.includes('+')) {
    isoString += 'Z';
  }

  const now = new Date();
  const date = new Date(isoString);

  const diff = date.getTime() - now.getTime();

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  const units = [
    { name: 'year',   ms: 1000 * 60 * 60 * 24 * 365 },
    { name: 'month',  ms: 1000 * 60 * 60 * 24 * 30 },
    { name: 'week',   ms: 1000 * 60 * 60 * 24 * 7 },
    { name: 'day',    ms: 1000 * 60 * 60 * 24 },
    { name: 'hour',   ms: 1000 * 60 * 60 },
    { name: 'minute', ms: 1000 * 60 },
    { name: 'second', ms: 1000 },
  ];

  for (const unit of units) {
    const diffInUnits = diff / unit.ms;
    if (Math.abs(diffInUnits) >= 1) {
      return rtf.format(Math.round(diffInUnits), unit.name as Intl.RelativeTimeFormatUnit);
    }
  }

  return 'Just now';
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
        <p className="text-sm text-gray-400">Created: {getRelativeTime(flow.createdAt)}</p>
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