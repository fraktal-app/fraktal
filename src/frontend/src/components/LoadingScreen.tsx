import { Workflow } from 'lucide-react';

function LoadingScreen() {
  return (
    <div className="h-screen w-screen bg-[#0d0f1c] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6 text-center">
        {/* Pulsing Icon Container */}
        <div className="relative flex h-20 w-20 items-center justify-center">
          {/* Outer pulse ring */}
          <div className="absolute h-full w-full rounded-full bg-[#6d3be4]/20 animate-pulse"></div>
          
          {/* Inner, delayed pulse ring */}
          <div
            className="absolute h-3/4 w-3/4 rounded-full bg-[#6d3be4]/20 animate-pulse"
            style={{ animationDelay: '0.5s' }}
          ></div>
          
          {/* Thematic Icon */}
          <Workflow className="h-10 w-10 text-[#a78bfa]" />
        </div>
        
        {/* Loading Text */}
        <p className="font-medium text-lg text-gray-400">Loading Editor...</p>
      </div>
    </div>
  );
}

export default LoadingScreen;