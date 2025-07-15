import { useState } from 'react';
import { Plus, Workflow } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import type { WorkflowType } from '../components/WorkflowCard';
import WorkflowCard from '../components/WorkflowCard';


// --- Sample Data ---
const sampleWorkflows: WorkflowType[] = [
  {
    workflowId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    name: "Post GitHub Stars to Discord & Notion",
    createdAt: "July 16, 2025",
    status: "published",
    trigger: {
      id: "trigger-github-1",
      appType: "github",
      label: "New Star",
    },
    actions: [
      {
        id: "action-discord-1",
        appType: "discord",
        label: "Send Channel Message",
      },
      {
        id: "action-notion-1",
        appType: "notion",
        label: "Create Page",
      }
    ]
  },
  {
    workflowId: 'b2c3d4e5-f6a7-8901-2345-67890abcdef1',
    name: "Summarize RSS Feed with AI and Post to Twitter",
    createdAt: "July 15, 2025",
    status: "published",
    trigger: {
      id: "trigger-rss-1",
      appType: "rss",
      label: "New Feed Item",
    },
    actions: [
       {
        id: "action-ai-1",
        appType: "ai",
        label: "Generate Text",
      },
      {
        id: "action-twitter-1",
        appType: "twitter",
        label: "Post Tweet",
      }
    ]
  },
  {
    workflowId: 'c3d4e5f6-a7b8-9012-3456-7890abcdef12',
    name: "Notify on Telegram for new Wallet Transactions",
    createdAt: "July 14, 2025",
    status: "draft",
    trigger: {
      id: "trigger-wallet-1",
      appType: "wallet",
      label: "New Transaction",
    },
    actions: [
      {
        id: "action-telegram-1",
        appType: "telegram",
        label: "Send Message",
      }
    ]
  }
];

const Home = () => {
  const navigate = useNavigate();
  // The 'setWorkflows' function is intentionally unused for now as the data is static.
  // Prefixing with an underscore `_` is a common convention to signal this to the linter.
  const [workflows, _setWorkflows] = useState<WorkflowType[]>(sampleWorkflows);
  const [statusFilter, setStatusFilter] = useState('all');

  const handleEditFlow = (workflowId: string) => {
    navigate(`/workflow-editor/${workflowId}`);
  };

  const handleCreateFlow = () => {
    const newWorkflowId = uuidv4();
    navigate(`/workflow-editor/${newWorkflowId}`);
  };

  const filteredWorkflows = workflows.filter(flow => 
    statusFilter === 'all' || flow.status === statusFilter
  );

  return (
    <div className="bg-gray-900 text-white p-4 sm:p-6 md:p-8 min-h-screen font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h3 className="text-3xl font-semibold">Workflows</h3>
          <button
            onClick={handleCreateFlow}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#6d3be4] hover:bg-[#5a2fc7] rounded-lg font-medium text-white shadow-lg transition-transform transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Create flow
          </button>
        </div>
        
        <div className="mb-6">
            <div className="max-w-xs">
              <label htmlFor="status" className="block text-sm font-medium text-gray-400 mb-2">
                Filter by Status
              </label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-md border-gray-600 bg-gray-800 py-2 px-3 text-white focus:ring-2 focus:ring-[#6d3be4] focus:border-[#6d3be4]"
              >
                <option value="all">All</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
        </div>

        {filteredWorkflows.length === 0 ? (
          <div className="border-2 border-dashed border-gray-700 rounded-lg p-12 text-center text-gray-500 mt-8">
            <Workflow className="w-12 h-12 mx-auto mb-4 text-gray-600" />
            <h4 className="text-xl font-semibold mb-2">No Workflows Found</h4>
            <p>Try changing the filter or click "Create flow" to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredWorkflows.map((flow) => (
              <WorkflowCard key={flow.workflowId} flow={flow} onEdit={handleEditFlow} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// The main App component that renders our Home page.
export default function App() {
  return <Home />;
}
