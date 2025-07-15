import { AlertCircle } from "lucide-react"

interface ValidationErrorBannerProps {
  validationError: string
}

export function ValidationErrorBanner({ validationError }: ValidationErrorBannerProps) {
  if (!validationError) return null
  
  return (
    <div className="bg-red-900/20 border-b border-red-500/50 px-6 py-3 flex items-center gap-3">
      <AlertCircle className="w-5 h-5 text-red-400" />
      <span className="text-red-400 text-sm">{validationError}</span>
    </div>
  )
}