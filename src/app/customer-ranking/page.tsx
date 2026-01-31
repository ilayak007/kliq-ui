"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CustomerRanking } from "@/components/customer-ranking/customer-ranking"
import { Spinner } from "@/components/ui/spinner"
import axios from "axios"

interface CustomerData {
  customerId: number
  customerName: string
  profileMessage: string
  profileImage: string
  totalPoints: number
  totalParticipated: number
  totalWon: number
  totalLost: number
}

function CustomerRankingPageContent() {
  const [customers, setCustomers] = useState<CustomerData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [highlightedCustomerId, setHighlightedCustomerId] = useState<number | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const tournamentId = searchParams.get("tournamentId")

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (!token) {
      router.push("/login")
    }
  }, [router])

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true)
        const apiUrl = process.env.NEXT_PUBLIC_KLIQ_BACKEND_API_URL;
        const url = tournamentId 
          ? `${apiUrl}/api/customers/dashboard?tournamentId=${tournamentId}`
          : `${apiUrl}/api/customers/dashboard`;
        const response = await axios.get(url)
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
  }, [tournamentId])

  const handleDashboardClick = () => {
    const url = tournamentId 
      ? `/predict?tournamentId=${tournamentId}`
      : "/predict";
    router.push(url)
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
      {/* Flex container for heading and buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">Rankings</h1>

        {/* Buttons always in a row, wrap if needed */}
        <div className="flex flex-row gap-4 flex-wrap">
          <button
            onClick={handleFindMeClick}
            className="bg-blue-300 p-3 rounded-lg cursor-pointer hover:bg-blue-400 transition-all text-sm"
          >
            Find Me
          </button>

          <button
            onClick={handleDashboardClick}
            className="bg-purple-300 p-3 rounded-lg cursor-pointer hover:bg-purple-400 transition-all text-sm"
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

export default function CustomerRankingPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[70vh]">
        <Spinner size={40} text="Loading Rankings" />
      </div>
    }>
      <CustomerRankingPageContent />
    </Suspense>
  );
}
