import { CustomerCard } from "./customer-card"

// Updated Customer interface to match CustomerData from the page
interface Customer {
  customerId: number
  customerName: string
  title: string
  profileImage: string
  totalPoints: number
  totalWon: number
  totalLost: number
}

interface CustomerRankingProps {
  customers: Customer[]
  title?: string
}

export function CustomerRanking({ customers, title = "Top Customers" }: CustomerRankingProps) {
  // Sort customers by totalPoints descending (highest first)
  const sortedCustomers = [...customers].sort((a, b) => b.totalPoints - a.totalPoints)

  return (
    <div className="space-y-4">
      {/* {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>} */}

      {sortedCustomers.map((customer, index) => (
        <CustomerCard
          key={customer.customerId} 
          customerId={customer.customerId}
          rank={index + 1}
          customerName={customer.customerName}
          title={customer.title}
          totalPoints={customer.totalPoints}
          totalWon={customer.totalWon}
          totalLost={customer.totalLost}
          profileImage={customer.profileImage}
        />
      ))}
    </div>
  )
}
