import { Check, X } from "lucide-react"

interface ResultsIconRowsProps {
  results: Array<{
    matchDate: string
    teamA: string
    teamB: string
    customerSelected: string
    result: string
    pointsEarned: string
  }>
}

export function ResultsIconRows({ results }: ResultsIconRowsProps) {
  return (
    <div className="flex flex-row-reverse gap-1.5 overflow-x-auto py-4">
      {results.map((result, index) => {
        // Handle "Result not updated" -> skip rendering
        if (result.pointsEarned === "Result not updated") {
          return null
        }
        const isLost = result.pointsEarned.includes("lost")
        return (
          <div
            key={index}
            className={`flex items-center justify-center w-5 h-5 rounded-full shadow-md 
              ${isLost ? "bg-red-500" : "bg-green-500"}`}
            title={`${result.teamA} vs ${result.teamB} on ${result.matchDate}`}
          >
            {isLost ? (
              <X className="text-white w-5 h-5" />
            ) : (
              <Check className="text-white w-5 h-5" />
            )}
          </div>
        )
      })}
    </div>
  )
}
