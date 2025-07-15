import React from 'react';
import { 
  MoreHorizontal, Workflow, ArrowRight, Send, Sheet, 
  BrainCircuit, Github, Rss, Wallet, Bot, Code, Link, Twitter, FileText 
} from 'lucide-react';

// --- Type Definitions for Workflow Data ---
// These types define the structure for a single workflow.
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
  status: 'draft' | 'published';
  trigger: Trigger;
  actions: Action[];
};

// --- App Icon Helper Component ---
// This component returns a specific icon based on the application type.
const AppIcon = ({ appType }: { appType: string }) => {
  switch (appType.toLowerCase()) {
    case 'telegram':
      return <Send className="w-5 h-5 text-blue-400" />;
    case 'discord':
      return <Bot className="w-5 h-5 text-indigo-400" />;
    case 'github':
      return <Github className="w-5 h-5 text-gray-300" />;
    case 'wallet':
      return <Wallet className="w-5 h-5 text-emerald-400" />;
    case 'token':
      return <Code className="w-5 h-5 text-amber-400" />;
    case 'rss':
      return <Rss className="w-5 h-5 text-orange-400" />;
    case 'notion':
      return <FileText className="w-5 h-5 text-gray-300" />;
    case 'webhook':
      return <Link className="w-5 h-5 text-cyan-400" />;
    case 'twitter':
      return <Twitter className="w-5 h-5 text-sky-400" />;
    case 'ai':
      return <BrainCircuit className="w-5 h-5 text-teal-400" />;
    case 'api':
      return <Code className="w-5 h-5 text-fuchsia-400" />;
    case 'google-sheets':
      return <Sheet className="w-5 h-5 text-green-400" />;
    default:
      return <Workflow className="w-5 h-5 text-gray-500" />;
  }
};

// --- Props for the WorkflowCard component ---
interface WorkflowCardProps {
  flow: WorkflowType;
  onEdit: (workflowId: string) => void;
}

// --- The Workflow Card Component ---
const WorkflowCard: React.FC<WorkflowCardProps> = ({ flow, onEdit }) => {
  return (
    <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 hover:border-[#6d3be4] transition-all duration-300 shadow-md hover:shadow-xl">
      {/* Card Header */}
      <div className="flex items-start justify-between mb-4">
        <h6 className="text-lg font-semibold truncate pr-4">{flow.name}</h6>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
            flow.status === 'published' 
            ? 'bg-green-900/50 text-green-300 border border-green-700' 
            : 'bg-yellow-900/50 text-yellow-300 border border-yellow-700'
          }`}>
            {flow.status}
          </span>
          <button className="p-1.5 rounded-md hover:bg-gray-700">
            <MoreHorizontal className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Workflow Steps Visualization */}
      <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-2">
        <div className="flex items-center gap-2 bg-gray-900/70 py-2 px-3 rounded-lg border border-gray-700">
          <AppIcon appType={flow.trigger.appType} />
          <span className="text-sm font-medium whitespace-nowrap">{flow.trigger.label}</span>
        </div>
        
        {flow.actions.map((action) => (
          <React.Fragment key={action.id}>
            <ArrowRight className="w-5 h-5 text-gray-500 flex-shrink-0" />
            <div className="flex items-center gap-2 bg-gray-900/70 py-2 px-3 rounded-lg border border-gray-700">
              <AppIcon appType={action.appType} />
              <span className="text-sm font-medium whitespace-nowrap">{action.label}</span>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Card Footer */}
      <div className="flex items-center justify-between text-sm">
        <p className="text-gray-400">Created: {flow.createdAt}</p>
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
