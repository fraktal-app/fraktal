// src/components/ConfirmDeleteModal.tsx

import { TriangleAlert, Loader2 } from 'lucide-react';
import React from 'react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  workflowTitle: string;
  isLoading: boolean; // Add prop to handle loading state
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  workflowTitle,
  isLoading, // Destructure the new prop
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
      onClick={!isLoading ? onClose : undefined} // Prevent closing on backdrop click when loading
    >
      {/* Modal Card */}
      <div
        className="relative mx-4 w-full max-w-md rounded-2xl bg-[#111827] p-6 shadow-xl border border-gray-700"
        onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
      >
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 rounded-full bg-red-500/10 p-3">
            <TriangleAlert className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-white">Delete Workflow?</h3>
          <p className="mt-2 text-gray-400">
            Are you sure you want to delete the workflow{' '}
            <strong className="text-gray-200">"{workflowTitle}"</strong>?
          </p>
          <p className="text-sm text-gray-500 mt-1">This action cannot be undone.</p>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <button
            onClick={onClose}
            disabled={isLoading} // Disable button when loading
            className="rounded-lg bg-gray-700 px-4 py-2.5 font-semibold text-white transition hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading} // Disable button when loading
            className="flex items-center justify-center rounded-lg bg-red-600 px-4 py-2.5 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;