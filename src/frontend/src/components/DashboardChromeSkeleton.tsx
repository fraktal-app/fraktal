// src/components/DashboardChromeSkeleton.tsx


const DashboardChromeSkeleton = () => {
  return (
    // Use a React Fragment as this component just renders two fixed-position elements.
    <>
      {/* --- Navbar Skeleton --- */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-[#1a1c2c] border-b border-gray-700/50 flex items-center justify-between px-4 animate-pulse z-20">
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 bg-gray-700 rounded-md"></div>
          <div className="hidden md:block h-6 w-32 bg-gray-700 rounded-lg"></div>
        </div>
      </div>

      {/* --- Sidebar Skeleton --- */}
      <div className="hidden md:block fixed top-0 left-0 h-full w-64 bg-[#1a1c2c] border-r border-gray-700/50 pt-20 p-4 animate-pulse z-10">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-9 w-full bg-gray-700 rounded-lg"></div>
          ))}
        </div>
        <div className="absolute bottom-5 left-4 right-4 h-9 bg-gray-700 rounded-lg"></div>
      </div>
    </>
  );
};

export default DashboardChromeSkeleton;