// src/pages/Home.tsx

import { useEffect, useState } from 'react';
import { Plus, Workflow } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import type { WorkflowType } from '../components/WorkflowCard';
import WorkflowCard from '../components/WorkflowCard';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import WorkflowCardSkeleton from '../components/WorflowSkeletons';


const Home = ({
  user_id
}: {
  user_id: string
}) => {

  const navigate = useNavigate();
  // Set initial state to undefined to track the initial loading state
  const [workflows, setWorkflows] = useState<WorkflowType[] | undefined>(undefined);

  // --- State for the delete confirmation modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [workflowToDelete, setWorkflowToDelete] = useState<WorkflowType | null>(null);

  useEffect(() => {
    const getWorkflows = async () => {
      try {
        // A small delay to make the skeleton visible for demonstration
        await new Promise(resolve => setTimeout(resolve, 500));

        const baseURL = `${window.location.protocol}//${window.location.host}`;
        const res = await fetch(baseURL + "/get-workflows-by-user-id", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: user_id })
        });
        const data = await res.json();
        
        if (!data.error) {
          setWorkflows(data);
        } else {
          setWorkflows([]);
        }
      } catch (e) {
        console.error(e);
        setWorkflows([]); // Set to empty array on error
      }
    }

    if (user_id) {
        getWorkflows();
    }
  }, [user_id])


  const handleEditFlow = (workflowId: string) => {
    navigate(`/workflow-editor/${workflowId}`);
  };

  const handleCreateFlow = () => {
    const newWorkflowId = uuidv4();
    navigate(`/workflow-editor/${newWorkflowId}`);
  };

  const openDeleteModal = (workflow: WorkflowType) => {
    setWorkflowToDelete(workflow);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setWorkflowToDelete(null);
    setIsModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!workflowToDelete) return;

    try {
      const baseURL = `${window.location.protocol}//${window.location.host}`;
      const res = await fetch(baseURL + "/delete-workflow", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflow_id: workflowToDelete.id })
      });
      const data = await res.json();

      if (data.success) {
        setWorkflows(prevWorkflows => prevWorkflows?.filter(flow => flow.id !== workflowToDelete.id));
      } else {
        alert(`Error deleting workflow: ${data.error || 'Unknown error'}`);
      }
    } catch (e) {
      alert(`An error occurred: ${e}`);
    } finally {
      closeDeleteModal();
    }
  };


  return (
    <>
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

          {/* --- 2. Render skeletons, empty state, or workflow list --- */}
          {workflows === undefined ? (
            // Loading State: Show skeleton cards
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <WorkflowCardSkeleton key={index} />
              ))}
            </div>
          ) : workflows.length === 0 ? (
            // Empty State: No workflows found
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-12 text-center text-gray-500 mt-8">
              <Workflow className="w-12 h-12 mx-auto mb-4 text-gray-600" />
              <h4 className="text-xl font-semibold mb-2">No Workflows Found</h4>
              <p>Click "Create flow" to get started.</p>
            </div>
          ) : (
            // Data Loaded: Show actual workflow cards
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workflows.map((flow) => (
                <WorkflowCard
                  key={flow.id}
                  flow={flow}
                  onEdit={handleEditFlow}
                  onDelete={() => openDeleteModal(flow)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        workflowTitle={workflowToDelete?.title || ''}
      />
    </>
  );
};

export default Home;