import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CreatorCard } from "@/components/creator-card"
import { Users } from "lucide-react"
import axios from "axios"

interface MatchingCreatorsProps {
  campaignId: string
}

export function MatchingCreators({ campaignId }: MatchingCreatorsProps) {
  const [creators, setCreators] = useState<Array<any>>([]) // Store fetched creators
  const [loading, setLoading] = useState(false) // Track loading state

  const fetchCreators = async () => {
    try {
      setLoading(true)
      const apiUrl = process.env.NEXT_PUBLIC_KLIQ_BACKEND_API_URL
      const response = await axios.get(`${apiUrl}/creators/top`)
      setCreators(response.data) // Update state with fetched creators
    } catch (error) {
      console.error("Error fetching creators:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="space-y-6">
      {/* Matching Creators Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-indigo-900/50 flex items-center justify-center">
            <Users className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Matching Creators</h2>
            <p className="text-sm text-gray-400">We are matching the best creators for your campaign</p>
          </div>
        </div>
        
        {/* Search Button */}
        <Button
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
          onClick={fetchCreators}
          disabled={loading} // Disable while loading
        >
          {loading ? "Fetching Top 3..." : "Search & Invite"}
        </Button>
      </div>

      {/* Display Matching Creators */}
      {creators.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {creators.map((creator) => (
            <CreatorCard
              key={creator.id}
              creator={{
                id: creator.id,
                name: creator.name,
                city: creator.city,
                country: creator.country,
                imageKey: creator.imageKey,
                followers: creator.followers,
                platforms: creator.platforms,
                imageUrl: creator.imageUrl || "/placeholder.svg",
                campaignId: campaignId, // Pass campaignId
              }}
              isInvited={false} // 🔹 Mark as NOT invited so button says "Send Invite"
              onRemove={() => setCreators(creators.filter((c) => c.id !== creator.id))}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No creators found.</p>
      )}
    </section>
  )
}
