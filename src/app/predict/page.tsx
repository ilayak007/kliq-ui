"use client"

import { useState, useEffect, Suspense, useMemo } from "react"
import axios from "axios"
import { Header } from "@/components/predict/header"
import { ParticipationRules } from "@/components/predict/participation-rules"
import { PointsSummary } from "@/components/predict/points-summary"
import { MatchPrediction } from "@/components/predict/match-prediction"
import { ResultsTable } from "@/components/predict/results-table"
import { ResultsIconRows } from "@/components/predict/results-icon-rows"
import { Switch } from "@/components/ui/switch"
import { Spinner } from "@/components/ui/spinner"
import { useRouter, useSearchParams } from "next/navigation"
import { SuccessModal } from "@/components/predict/prediction-modal"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Tournament } from "@/types/tournament"

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
  totalVoteCount: number
}

interface ResultData {
  matchDate: string
  teamA: string
  teamB: string
  customerSelected: string
  result: string
  pointsEarned: string
}

interface DetailedSummaryResponse {
  detailedSummary: ResultData[]
  longestCorrectStreak: number
}

/**
 * Returns YYYY-MM-DD string in IST for a given date object.
 */
const getISTDateKey = (date: Date) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date)

  const y = parts.find(p => p.type === "year")?.value
  const m = parts.find(p => p.type === "month")?.value
  const d = parts.find(p => p.type === "day")?.value
  return `${y}-${m}-${d}`
}

/**
 * Format a date (YYYY-MM-DD) into a nice IST label like: "Saturday, 7 February 2026"
 */
const formatISTHeaderDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date)
}

function PredictPageContent() {
  const [showResults, setShowResults] = useState(false)
  const [date, setDate] = useState<string>("")
  const [tournamentId, setTournamentId] = useState<string | null>(null)
  const [tournamentName, setTournamentName] = useState<string>("")
  const [tournamentDescription, setTournamentDescription] = useState<string>("")

  const [pointsSummary, setPointsSummary] = useState<PointsSummaryData | null>(null)
  const [todaysMatches, setTodaysMatches] = useState<MatchData[] | null>(null)
  const [results, setResults] = useState<ResultData[] | null>(null)
  const [longestCorrectStreak, setLongestCorrectStreak] = useState<number>(0)

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
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (!token) {
      router.push("/login")
    }
  }, [router])

  // Handle tournamentId from URL parameters
  useEffect(() => {
    const tournamentIdParam = searchParams.get("tournamentId")
    if (tournamentIdParam) {
      setTournamentId(tournamentIdParam)
      fetchTournamentName(tournamentIdParam)
    } else {
      router.push("/tournaments")
    }
  }, [searchParams, router])

  // Fetch tournament name
  const fetchTournamentName = async (id: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_KLIQ_BACKEND_API_URL
      const response = await axios.get(`${apiUrl}/api/tournaments`)
      const tournaments = response.data.data || []
      const tournament = tournaments.find((t: Tournament) => t.tournamentId === id)
      if (tournament) {
        setTournamentName(tournament.tournamentName)
        setTournamentDescription(tournament.description || "Log in - Predict the winner - Earn points - Win vouchers")
      }
    } catch (error) {
      console.error("Error fetching tournament name:", error)
    }
  }

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

  // Set the current date (IST)
  useEffect(() => {
    const now = new Date()
    setDate(formatISTHeaderDate(now))
  }, [])

  const apiUrl = process.env.NEXT_PUBLIC_KLIQ_BACKEND_API_URL

  // Fetch points summary
  useEffect(() => {
    if (!customerId || !tournamentId) return

    const fetchPointsSummary = async () => {
      try {
        setLoadingPointsSummary(true)
        const response = await axios.get(
          `${apiUrl}/api/customer/points-summary?customerId=${customerId}&tournamentId=${tournamentId}`
        )
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
  }, [customerId, tournamentId, apiUrl])

  // Fetch matches (today + optionally tomorrow from backend)
  useEffect(() => {
    if (!customerId || !tournamentId) return

    const fetchTodaysMatches = async () => {
      try {
        setLoadingTodaysMatches(true)
        const response = await axios.get(
          `${apiUrl}/api/matches/todays-matches?customerId=${customerId}&tournamentId=${tournamentId}`
        )
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
  }, [customerId, tournamentId, apiUrl])

  // Fetch results when showResults toggled ON
  useEffect(() => {
    if (!showResults || !customerId || !tournamentId) return

    const fetchResults = async () => {
      try {
        setLoadingResults(true)
        const response = await axios.get(`${apiUrl}/api/customers/${customerId}/detailed-summary/${tournamentId}`)
        const data: DetailedSummaryResponse = response.data
        setResults(data.detailedSummary)
        setLongestCorrectStreak(data.longestCorrectStreak)
        setErrorResults(null)
      } catch (error) {
        console.log("Error fetching results:", error)
      } finally {
        setLoadingResults(false)
      }
    }

    fetchResults()
  }, [showResults, customerId, tournamentId, apiUrl])

  // ✅ Split matches into Today & Tomorrow (IST)
  const { todayMatches, tomorrowMatches, tomorrowHeaderLabel } = useMemo(() => {
    const all = todaysMatches || []

    const now = new Date()
    const todayKey = getISTDateKey(now)

    const tomorrow = new Date(now.getTime())
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowKey = getISTDateKey(tomorrow)

    const todayBucket: MatchData[] = []
    const tomorrowBucket: MatchData[] = []

    for (const match of all) {
      const matchKey = getISTDateKey(new Date(match.matchStartDateTime))
      if (matchKey === todayKey) todayBucket.push(match)
      else if (matchKey === tomorrowKey) tomorrowBucket.push(match)
    }

    // (Backend already sorts, but keep safe)
    const sortAsc = (a: MatchData, b: MatchData) =>
      new Date(a.matchStartDateTime).getTime() - new Date(b.matchStartDateTime).getTime()

    todayBucket.sort(sortAsc)
    tomorrowBucket.sort(sortAsc)

    return {
      todayMatches: todayBucket,
      tomorrowMatches: tomorrowBucket,
      tomorrowHeaderLabel: formatISTHeaderDate(tomorrow),
    }
  }, [todaysMatches])

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

      // ✅ Re-fetch matches (include tournamentId, since the screen is tournament scoped)
      if (customerId && tournamentId) {
        const response = await axios.get(
          `${apiUrl}/api/matches/todays-matches?customerId=${customerId}&tournamentId=${tournamentId}`
        )
        setTodaysMatches(response.data.data)
      }
    } catch (error) {
      console.error("Error submitting prediction:", error)
    }
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <Header
          tournamentName={tournamentName}
          tournamentId={tournamentId || undefined}
          tournamentDescription={tournamentDescription}
        />

        {/* Back to Tournaments Button */}
        <div className="mt-4 mb-6">
          <Link
            href="/tournaments"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tournaments
          </Link>
          {tournamentName && (
            <h1 className="text-2xl font-bold mt-2 text-gray-800"></h1>
          )}
        </div>

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
            <PointsSummary data={pointsSummary} tournamentId={tournamentId} />
          ) : null}
        </div>

        {/* ✅ MATCHES SECTION */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{date}</h2>
          </div>

          {(todaysMatches && todaysMatches.length > 0) && (
            <p className="text-gray-400 mt-0.6">
              Predictions will close 30 minutes before the match begins.
            </p>
          )}

          {loadingTodaysMatches ? (
            <div className="flex items-center justify-center min-h-[70vh]">
              <Spinner size={40} text="Loading matches..." />
            </div>
          ) : errorTodaysMatches && !todaysMatches ? (
            <div className="text-center py-4 text-red-500">{errorTodaysMatches}</div>
          ) : (todaysMatches && todaysMatches.length > 0) ? (
            <div className="space-y-8 mt-4">
              {/* ✅ Today */}
              {todayMatches.length > 0 && (
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-3">
                    Today&apos;s Matches
                  </h3>
                  <div className="space-y-4">
                    {todayMatches.map((match) => (
                      <MatchPrediction
                        key={match.matchId}
                        match={match}
                        onSubmit={(prediction) => handlePredictionSubmit(match.matchId, prediction)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* ✅ Tomorrow */}
              {tomorrowMatches.length > 0 && (
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-1">
                    Tomorrow&apos;s Matches
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">{tomorrowHeaderLabel}</p>

                  <div className="space-y-4">
                    {tomorrowMatches.map((match) => (
                      <MatchPrediction
                        key={match.matchId}
                        match={match}
                        onSubmit={(prediction) => handlePredictionSubmit(match.matchId, prediction)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* If somehow list exists but neither bucket matched */}
              {todayMatches.length === 0 && tomorrowMatches.length === 0 && (
                <div className="text-center py-4 text-red-600 font-large">
                  No matches available for today / tomorrow.
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4 text-red-600 font-large">
              Tomorrow's matches will be available soon. Please come back shorty. Thanks!
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mt-12">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">Result Summary</h2>
              <Switch checked={showResults} onCheckedChange={setShowResults} />
            </div>

            {showResults && longestCorrectStreak > 0 && results && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full w-fit">
                  Longest winning streak: {longestCorrectStreak}
                </span>
                <ResultsIconRows results={results} />
              </div>
            )}
          </div>
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

export default function FifaChallengePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white text-black">
          <Spinner />
        </div>
      }
    >
      <PredictPageContent />
    </Suspense>
  )
}
