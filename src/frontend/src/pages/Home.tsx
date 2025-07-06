import {
  Plus,
  MoreHorizontal,
  Workflow,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

const Home = () => {
  const navigate = useNavigate();
  
  type Flow = {
    id: number;
    workflowId: string; 
    name: string;
    createdAt: string;
    status: string;
  };
  
  const flows: Flow[] = [];
  
  const handleEditFlow = (workflowId: string) => {
    navigate(`/workflow-editor/${workflowId}`);
  };
  
  const handleCreateFlow = () => {
    // Generate a new UUID for the workflow
    const newWorkflowId = uuidv4();
    navigate(`/workflow-editor/${newWorkflowId}`);
  };
  
  return (
    <div className="text-white p-6 relative">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h3 className="text-3xl font-semibold">Workflows</h3>
        <button
          onClick={handleCreateFlow}
          className="flex items-center gap-2 px-6 py-3 bg-[#6d3be4] hover:bg-[#5a2fc7] rounded-xl font-medium text-[#ffffff] shadow-lg transition"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create flow
        </button>
      </div>
      <div className="flex flex-col md:flex-row gap-52">
        <div className="w-full ">
          <div className="max-w-xs mb-4">
            <label htmlFor="status" className="block text-sm font-medium mb-1">
              Status
            </label>
            <select
              id="status"
              className="w-full rounded border border-gray-600 bg-gray-800 py-2 px-3 text-white"
            >
              <option value="all">All</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          {flows.length === 0 ? (
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-10 text-center text-gray-500 ">
              No workflows yet. Click "Create flow" to get started.
            </div>
          ) : (
            flows.map((flow) => (
              <div
                key={flow.id}
                className="bg-gray-800 rounded-lg p-4 flex items-start justify-between hover:shadow-lg transition mb-4"
              >
                <div className="flex items-center gap-4">
                  <Workflow className="w-10 h-10 text-fuchsia-500 bg-gray-900 p-2 rounded" />
                  <div>
                    <h6 className="text-lg font-semibold truncate">{flow.name}</h6>
                    <p className="text-sm text-gray-400">created {flow.createdAt}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 border border-fuchsia-800 text-fuchsia-600 rounded text-xs">
                    {flow.status}
                  </span>
                  <button
                    className="p-2 rounded hover:bg-gray-700"
                    onClick={() => handleEditFlow(flow.workflowId)}
                  >
                    <MoreHorizontal className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;