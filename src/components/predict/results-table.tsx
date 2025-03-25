interface ResultsTableProps {
  results: Array<{
    matchDate: string
    teamA: string
    teamB: string
    customerSelected: string
    result: string
    pointsEarned: string
  }>
}

export function ResultsTable({ results }: ResultsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="py-3 text-left font-semibold">Date</th>
            <th className="py-3 text-left font-semibold">Match</th>
            <th className="py-3 text-left font-semibold">Your Vote</th>
            <th className="py-3 text-left font-semibold">Actual Result</th>
            <th className="py-3 text-left font-semibold">Points earned</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr
              key={index}
              className="border-b border-gray-300 hover:bg-gray-100 cursor-pointer transition-all"
            >
              <td className="py-4">{result.matchDate}</td>
              <td className="py-4 break-words">
                {result.teamA} - {result.teamB}
              </td>
              <td className="py-4">{result.customerSelected}</td>
              <td className="py-4">{result.result}</td>
              <td
                className={`py-4 ${result.pointsEarned.includes("lost") ? "text-red-500" : "text-green-500"}`}
              >
                {result.pointsEarned}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
