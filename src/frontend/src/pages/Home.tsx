import { useEffect, useState } from 'react';
import { Plus, Workflow } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import type { WorkflowType } from '../components/WorkflowCard';
import WorkflowCard from '../components/WorkflowCard';


const Home = ({
  user_id
}: {
  user_id: string
}) => {

  const navigate = useNavigate();
  const [workflows, _setWorkflows] = useState<WorkflowType[]>();

  useEffect(() => {
    const getWorkflows = async () => {
      try{
        const baseURL = `${window.location.protocol}//${window.location.host}`;

        const res = await fetch(baseURL + "/get-workflows-by-user-id", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user_id: user_id
          })
        });

        var data = await res.json();
      }
      catch(e){
        alert(e)
      }
      _setWorkflows(data);
    }

    getWorkflows();
  }, [])
  

  const handleEditFlow = (workflowId: string) => {
    navigate(`/workflow-editor/${workflowId}`);
  };

  const handleCreateFlow = () => {
    const newWorkflowId = uuidv4();
    navigate(`/workflow-editor/${newWorkflowId}`);
  };

  return (
     <div className="bg-gray-900 text-white p-4 sm:p-6 md:p-8 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto">
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
        {!workflows && (
          <h1>Loading....</h1>
        )}
        {workflows && workflows.length === 0 ? (
          <div className="border-2 border-dashed border-gray-700 rounded-lg p-12 text-center text-gray-500 mt-8">
            <Workflow className="w-12 h-12 mx-auto mb-4 text-gray-600" />
            <h4 className="text-xl font-semibold mb-2">No Workflows Found</h4>
            <p>Click "Create flow" to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflows && workflows.map((flow) => (
              <>
                <WorkflowCard key={flow.id} flow={flow} onEdit={handleEditFlow} />
              </>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;