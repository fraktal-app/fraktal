function LoadingScreen() {
  return (
     <div className="h-screen bg-[#0d0f1c] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6d3be4] mx-auto mb-4"></div>
          <h1 className="text-xl font-semibold text-[#ffffff]">Loading...</h1>
        </div>
    </div>
  )
}

export default LoadingScreen