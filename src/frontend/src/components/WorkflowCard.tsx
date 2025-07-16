import React from 'react';

type Trigger = {
  id: string;
  appType: string;
  label: string;
};

type Action = {
  id: string;
  appType: string;
  label: string;
};

export type WorkflowType = {
  workflowId: string;
  name: string;
  createdAt: string;
  trigger: Trigger;
  actions: Action[];
};

interface WorkflowCardProps {
  flow: WorkflowType;
  onEdit: (workflowId: string) => void;
}

const WorkflowCard: React.FC<WorkflowCardProps> = ({ flow, onEdit }) => {
  return (
    <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 hover:border-[#6d3be4] transition-all duration-300 shadow-md hover:shadow-xl flex flex-col justify-between ">
      <div>
        <h6 className="text-lg font-semibold line-clamp-3">{flow.name}</h6>
      </div>
      <div className="flex items-center justify-between mt-6">
        <p className="text-sm text-gray-400">Created: {flow.createdAt}</p>
        <button
          onClick={() => onEdit(flow.workflowId)}
          className="font-semibold text-[#8a5cf6] hover:text-[#a78bfa] transition"
        >
          Edit Workflow
        </button>
      </div>
    </div>
  );
};

export default WorkflowCard;
