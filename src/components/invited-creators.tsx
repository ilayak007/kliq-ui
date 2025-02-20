// import { Button } from "@/components/ui/button"
import { CreatorCard } from "@/components/creator-card"
import { Users } from "lucide-react"
import { useState } from "react"

interface InvitedCreatorsProps {
  creators: Array<{
    id: string
    campaignId: string
    creator: {
      id: string
      name: string
      city: string
      country: string
      followers: string
      platforms: string[]
      imageKey: string | null
      imageUrl: string | null
    }
  }>
}

export function InvitedCreators({ creators }: InvitedCreatorsProps) {
  const [invitedCreators, setInvitedCreators] = useState(creators)

  const handleRemoveCreator = (creatorId: string) => {
    setInvitedCreators((prevCreators) =>
      prevCreators.filter((invited) => invited.creator.id !== creatorId)
    )
  }

  return (
    <section className="space-y-6 bg-zinc-900 p-6 rounded-lg"> {/* ✅ Background color applied */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-900/50 flex items-center justify-center">
            <Users className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Invited Creators</h2>
            <p className="text-sm text-gray-400">Invite creators to activate your campaign</p>
          </div>
        </div>
        {/* <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Invite Creators</Button> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {invitedCreators?.map((invited) => (
          <CreatorCard
            key={invited.creator.id}
            creator={{
              id: invited.creator.id,
              name: invited.creator.name,
              city: invited.creator.city,
              country: invited.creator.country,
              imageKey: invited.creator.imageKey,
              followers: invited.creator.followers,
              platforms: invited.creator.platforms,
              imageUrl: invited.creator.imageUrl || "/placeholder.svg",
              campaignId: invited.campaignId,
            }}
            isInvited={true}
            onRemove={handleRemoveCreator}
          />
        ))}
      </div>
    </section>
  )
}
