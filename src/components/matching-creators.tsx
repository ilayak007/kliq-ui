import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CreatorCard } from "@/components/creator-card"
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Users } from "lucide-react"
import axios from "axios"

interface MatchingCreatorsProps {
  campaignId: string
  isActive: boolean
}

interface Creator {
  id: string
  name: string
  city: string
  country: string
  followers: string
  platforms: string[]
  imageUrl: string | null
  imageKey: string | null
}

export function MatchingCreators({ campaignId, isActive }: MatchingCreatorsProps) {
  const [creators, setCreators] = useState<Creator[]>([]) 
  const [loading, setLoading] = useState(false) 
  const [hasSearched, setHasSearched] = useState(false) 
  const [isDialogOpen, setIsDialogOpen] = useState(false) 

  const fetchCreators = async () => {
    if (!isActive) {
      setIsDialogOpen(true) 
      return
    }

    try {
      setLoading(true)
      setHasSearched(true) 
      const apiUrl = process.env.NEXT_PUBLIC_KLIQ_BACKEND_API_URL
      const response = await axios.get(`${apiUrl}/creators/top`, {
        params: { excludeCampaignId: campaignId }, 
      });
  
      setCreators(response.data) 
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
          disabled={loading} 
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
                campaignId: campaignId, 
              }}
              isInvited={false} 
              onRemove={() => setCreators(creators.filter((c) => c.id !== creator.id))}
            />
          ))}
        </div>
      ) : (
        hasSearched && <p className="text-gray-400">No creators found.</p> 
      )}

      {/* Warning Dialog for DRAFT Campaign */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogTitle className="text-white text-lg mb-2">Campaign in Draft</DialogTitle>
          <DialogDescription className="text-gray-300 mb-4">
            You cannot invite creators while the campaign is in DRAFT status.
          </DialogDescription>
          <DialogClose className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-md mt-2">
            Close
          </DialogClose>
      </DialogContent>
      </Dialog>
    </section>
  )
}
