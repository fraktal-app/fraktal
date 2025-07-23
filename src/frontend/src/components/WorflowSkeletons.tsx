import React from 'react';

const WorkflowCardSkeleton: React.FC = () => {
  return (
    <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 flex flex-col justify-between animate-pulse">
      {/* Skeleton for Title Area */}
      <div>
        <div className="h-5 bg-gray-700 rounded-md w-3/4 mb-3"></div>
      </div>

      {/* Skeleton for Footer Area */}
      <div className="flex items-center justify-between mt-6">
        <div className="h-4 bg-gray-700 rounded-md w-2/5"></div>
        <div className="h-6 bg-gray-700 rounded-lg w-1/3"></div>
      </div>
    </div>
  );
};

export default WorkflowCardSkeleton;