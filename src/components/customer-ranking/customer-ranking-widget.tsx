import { CustomerCard } from "./customer-card"

interface Customer {
  id: string
  rank: number
  name: string
  profileMessage: string
  popularity: number
  likes: number
  followed: number
  profileImage: string
}

interface CustomerRankingWidgetProps {
  customers: Customer[]
  limit?: number
}

export function CustomerRankingWidget({ customers, limit = 3 }: CustomerRankingWidgetProps) {
  // Sort customers by rank and limit the number shown
  const topCustomers = [...customers].sort((a, b) => a.rank - b.rank).slice(0, limit)

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Top Performers</h3>
        <a href="/customer-ranking" className="text-blue-600 hover:underline text-sm">
          View All
        </a>
      </div>

      <div className="space-y-4">
        {topCustomers.map((customer) => (
          <CustomerCard
            key={customer.id}
            rank={customer.rank}
            customerName={customer.name}
            profileMessage={customer.profileMessage}
            totalPoints={customer.popularity}
            totalWon={customer.likes}
            totalLost={customer.followed}
            profileImage={customer.profileImage}
          />
        ))}
      </div>
    </div>
  )
}

