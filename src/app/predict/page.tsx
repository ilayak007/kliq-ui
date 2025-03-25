"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Header } from "@/components/predict/header"
import { ParticipationRules } from "@/components/predict/participation-rules"
import { PointsSummary } from "@/components/predict/points-summary"
import { MatchPrediction } from "@/components/predict/match-prediction"
import { ResultsTable } from "@/components/predict/results-table"
import { Switch } from "@/components/ui/switch"
import { Spinner } from "@/components/ui/spinner"
import { useRouter } from "next/navigation"
import { SuccessModal } from "@/components/predict/prediction-modal"

// Types for API responses
interface PointsSummaryData {
  totalPredicted: number
  totalWon: number
  totalLost: number
  totalPointsEarned: number
  position: number
}

interface MatchData {
  matchId: number
  teamA: string
  teamB: string  
  matchStartDateTime: string
}

interface ResultData {
  matchDate: string
  teamA: string
  teamB: string
  customerSelected: string
  result: string
  pointsEarned: string
}

export default function FifaChallengePage() {
  const [showResults, setShowResults] = useState(false)
  const [date, setDate] = useState<string>("")

  const [pointsSummary, setPointsSummary] = useState<PointsSummaryData | null>(null)
  const [todaysMatches, setTodaysMatches] = useState<MatchData[] | null>(null)
  const [results, setResults] = useState<ResultData[] | null>(null)

  const [loadingPointsSummary, setLoadingPointsSummary] = useState(true)
  const [loadingTodaysMatches, setLoadingTodaysMatches] = useState(true)
  const [loadingResults, setLoadingResults] = useState(true)

  const [errorPointsSummary, setErrorPointsSummary] = useState<string | null>(null)
  const [errorTodaysMatches, setErrorTodaysMatches] = useState<string | null>(null)
  const [errorResults, setErrorResults] = useState<string | null>(null)

  const [customerId, setCustomerId] = useState<number | null>(null)
  const [customerName, setCustomerName] = useState<string>("")

    // ✅ Success Modal State
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [predictedTeam, setPredictedTeam] = useState<string>("")

  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (!token) {
      router.push("/login")
    }
  }, [])

//   const verifyToken = async () => {
//     try {
//       const res = await axios.get("http://localhost:3000/api/auth/verify-token", {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       if (!res.data.valid) {
//         router.push("/login")
//       }
//     } catch (err) {
//       router.push("/login")
//     }
//   }

//   verifyToken()
// }, [])

  // Load customerId and customerName from localStorage
  useEffect(() => {
    const token = localStorage.getItem("authToken")
    const storedCustomerId = localStorage.getItem("customerId")
    const storedCustomerName = localStorage.getItem("customerName")

    if (!token || !storedCustomerId) {
      console.log("No token or customer ID found, redirecting...")
      return
    }

    setCustomerId(Number(storedCustomerId))
    setCustomerName(storedCustomerName || "")
  }, [])

  // Set the current date
  useEffect(() => {
    const currentDate = new Date().toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    setDate(currentDate)
  }, [])

  const apiUrl = process.env.NEXT_PUBLIC_KLIQ_BACKEND_API_URL;

  // Fetch points summary with guard
  useEffect(() => {
    if (!customerId) return; // ✅ Guard added

    const fetchPointsSummary = async () => {
      try {
        setLoadingPointsSummary(true)
        const response = await axios.get(`${apiUrl}/api/customer/points-summary?customerId=${customerId}`)
        setPointsSummary(response.data.data)
        setErrorPointsSummary(null)
      } catch (error) {
        console.error("Error fetching points summary:", error)
        setErrorPointsSummary("Failed to load points summary")
      } finally {
        setLoadingPointsSummary(false)
      }
    }

    fetchPointsSummary()
  }, [customerId])

  // Fetch today's matches with guard
  useEffect(() => {
    if (!customerId) return; // ✅ Guard added

    const fetchTodaysMatches = async () => {
      try {
        setLoadingTodaysMatches(true)
        const response = await axios.get(`${apiUrl}/api/matches/todays-matches?customerId=${customerId}`)
        setTodaysMatches(response.data.data)
        setErrorTodaysMatches(null)
      } catch (error) {
        console.error("Error fetching today's matches:", error)
        setErrorTodaysMatches("Failed to load today's matches")
      } finally {
        setLoadingTodaysMatches(false)
      }
    }

    fetchTodaysMatches()
  }, [customerId])

  // Fetch results when showResults toggled ON and customerId is present
  useEffect(() => {
    if (!showResults || !customerId) return; // ✅ Guard added

    const fetchResults = async () => {
      try {
        setLoadingResults(true)
        const response = await axios.get(`${apiUrl}/api/customers/${customerId}/detailed-summary`)
        setResults(response.data)
        setErrorResults(null)
      } catch (error) {
        console.log("Error fetching results:", error)
        //setErrorResults("Failed to load results")
      } finally {
        setLoadingResults(false)
      }
    }

    fetchResults()
  }, [showResults, customerId])

  // Prediction Submit
  const handlePredictionSubmit = async (matchId: number, prediction: string) => {
    try {
      await axios.post(`${apiUrl}/api/predictions/`, {
        matchId,
        customerSelected: prediction,
        customerId,
        customerName,
      })

          // ✅ Show Success Modal with predicted team
      setPredictedTeam(prediction)
      setShowSuccessModal(true)

      // Re-fetch today's matches
      const response = await axios.get(`${apiUrl}/api/matches/todays-matches?customerId=${customerId}`)
      setTodaysMatches(response.data.data)
    } catch (error) {
      console.error("Error submitting prediction:", error)
    }
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Header />

        <div className="mt-8">
          <ParticipationRules />
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Your Points Summary</h2>
          {loadingPointsSummary ? (
            <div className="flex items-center justify-center min-h-[70vh]">
              <Spinner size={40} text="Loading points summary..." />
            </div>
          ) : errorPointsSummary && !pointsSummary ? (
            <div className="text-center py-4 text-red-500">{errorPointsSummary}</div>
          ) : pointsSummary ? (
            <PointsSummary data={pointsSummary} />
          ) : null}
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold">Todays Game - {date}</h2>
          {loadingTodaysMatches ? (
            <div className="flex items-center justify-center min-h-[70vh]">
              <Spinner size={40} text="Loading todays matches..." />
            </div>
          ) : errorTodaysMatches && !todaysMatches ? (
            <div className="text-center py-4 text-red-500">{errorTodaysMatches}</div>
          ) : todaysMatches && todaysMatches.length > 0 ? (
            <div className="space-y-4 mt-4">
              {todaysMatches.map((match) => (
                <MatchPrediction
                  key={match.matchId}
                  match={match}
                  onSubmit={(prediction) => handlePredictionSubmit(match.matchId, prediction)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-red-600 font-medium">No more matches scheduled for today. Come Tomorrow !!!</div>
          )}
        </div>

        <div className="mt-12 flex items-center gap-2">
          <h2 className="text-lg font-semibold">Result Summary</h2>
          <Switch checked={showResults} onCheckedChange={setShowResults} />
        </div>

        {showResults && (
          <div className="mt-4">
            {loadingResults ? (
              <div className="flex items-center justify-center min-h-[20vh]">
                <Spinner size={40} text="Fetching Detailed Summary" />
              </div>
            ) : errorResults && !results ? (
              <div className="text-center py-4 text-red-500">{errorResults}</div>
            ) : results && results.length > 0 ? (
              <ResultsTable results={results} />
            ) : (
              <div className="text-center text-red-500 py-4">No results available</div>
            )}
          </div>
        )}
      </div>

        {/* ✅ Render Success Modal */}
      {showSuccessModal && (
        <SuccessModal clubName={predictedTeam} onClose={() => setShowSuccessModal(false)} />
      )}

    </div>
  )
}
