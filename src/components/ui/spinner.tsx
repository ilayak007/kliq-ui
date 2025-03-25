import { Loader2 } from "lucide-react"

interface SpinnerProps {
  size?: number
  text?: string
  className?: string
}

export function Spinner({ size = 24, text = "Loading", className = "" }: SpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Loader2 className="animate-spin text-indigo-600" style={{ width: size, height: size }} />
      {text && <p className="mt-2 text-sm text-gray-600 font-medium">{text}</p>}
    </div>
  )
}

