"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CustomerRanking } from "@/components/customer-ranking/customer-ranking"
import { Spinner } from "@/components/ui/spinner"
import axios from "axios"

interface CustomerData {
  customerId: number
  customerName: string
  title: string
  profileImage: string
  totalPoints: number
  totalParticipated: number
  totalWon: number
  totalLost: number
}

export default function CustomerRankingPage() {
  const [customers, setCustomers] = useState<CustomerData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (!token) {
      router.push("/login")
    }
  }, [])

  
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true)
        const apiUrl = process.env.NEXT_PUBLIC_KLIQ_BACKEND_API_URL;
        const response = await axios.get(`${apiUrl}/api/customers/dashboard`)
        setCustomers(response.data.data)
        setError(null)
      } catch (err) {
        console.error("Error fetching customer rankings:", err)
        setError("Failed to load customer rankings")
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [])

  const handleDashboardClick = () => {
    router.push("/predict")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Spinner size={40} text="Fetching Customer Rankings" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Flex container to align heading and button side by side */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="text-3xl font-bold">Customer Rankings</h1>

        {/* Button with click handler */}
        <div>
          <button
            onClick={handleDashboardClick}
            className="bg-purple-300 p-4 rounded-lg cursor-pointer hover:bg-purple-400 transition-all w-full sm:w-auto mt-4 sm:mt-0"
          >
            Go to My Dashboard
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      <CustomerRanking customers={customers} />
    </div>
  )
}
