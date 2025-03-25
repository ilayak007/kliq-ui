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
  const [highlightedCustomerId, setHighlightedCustomerId] = useState<number | null>(null)
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
        //const apiUrl = "http://localhost:3000"
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

  const handleFindMeClick = () => {
    const customerId = localStorage.getItem("customerId")
    if (customerId) {
      const parsedCustomerId = parseInt(customerId, 10)
      setHighlightedCustomerId(parsedCustomerId)

      // Remove the highlight after 3 seconds
      setTimeout(() => {
        setHighlightedCustomerId(null)
      }, 3000)
    }
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
      {/* Flex container to align heading and buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">Rankings</h1>

        {/* Button container fixed with gap and responsive layout */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button
            onClick={handleFindMeClick}
            className="bg-blue-300 p-4 rounded-lg cursor-pointer hover:bg-blue-400 transition-all w-full sm:w-auto"
          >
            Find Me
          </button>

          <button
            onClick={handleDashboardClick}
            className="bg-purple-300 p-4 rounded-lg cursor-pointer hover:bg-purple-400 transition-all w-full sm:w-auto"
          >
            Go to My Dashboard
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <CustomerRanking customers={customers} highlightedCustomerId={highlightedCustomerId} />
    </div>
  )
}
