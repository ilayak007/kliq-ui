/**
 * InvitedCreators Component
 * 
 * Displays a list of invited creators for a specific campaign, 
 * allows searching for new creators to invite, and supports 
 * removing invited creators. Prevents inviting when the campaign 
 * is in a DRAFT state by showing a dialog.
 * 
* @author Ilayaraja Kasirajan
 * @created [19-Feb-2025]
 * @lastModified [23-Feb-2025]
*/

import { useState, useRef } from "react";
import { CreatorCard } from "@/components/creator-card";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

// Types
interface Creator {
  id: string;
  name: string;
  city: string;
  country: string;
  followers: string;
  platforms: string[];
  imageKey: string | null;
  imageUrl: string | null;
}

interface InvitedCreatorsProps {
  creators: Array<{
    id: string;
    campaignId: string;
    creator: Creator;
  }>;
  updateMatchingCreators: (creators: Creator[]) => void;
  campaignId: string;
  isActive: boolean; // Indicates if the campaign is active or in DRAFT
}

export function InvitedCreators({ creators, updateMatchingCreators, campaignId, isActive }: InvitedCreatorsProps) {
  const [invitedCreators, setInvitedCreators] = useState(creators); // Local state for invited creators
  const [loading, setLoading] = useState(false); // Loading state for API calls
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Controls the warning dialog
  const sectionRef = useRef<HTMLDivElement | null>(null); // For potential DOM manipulations

  /**
   * handleRemoveCreator
   * Removes a creator from the invited list locally.
   */
  const handleRemoveCreator = (creatorId: string) => {
    setInvitedCreators((prevCreators) =>
      prevCreators.filter((invited) => invited.creator.id !== creatorId)
    );
  };

  /**
   * handleSearchAndInvite
   * Triggers the search for new creators. Shows a dialog if the campaign is in DRAFT.
   */
  const handleSearchAndInvite = async () => {
    if (!isActive) {
      setIsDialogOpen(true); // Open dialog if campaign is not active
      return;
    }

    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_KLIQ_BACKEND_API_URL;

      // Fetch top creators excluding those already in the campaign
      const response = await axios.get(`${apiUrl}/creators/top`, {
        params: { excludeCampaignId: campaignId },
      });

      updateMatchingCreators(response.data); // Update matching creators in parent component

      // Smooth scroll to the bottom to view new creators
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      }, 100);

    } catch (error) {
      console.error("Error fetching creators:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-6 bg-zinc-900 p-6 rounded-lg" ref={sectionRef}>

{/* Section Header */}
<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
  <div className="flex items-center gap-4">
    <div className="w-10 h-10 rounded-full bg-emerald-900/50 flex items-center justify-center">
      <Users className="w-5 h-5 text-emerald-400" />
    </div>
    <div>
      <h2 className="text-xl font-semibold">Invited Creators</h2>
      <p className="text-sm text-gray-400">Invite creators to activate your campaign</p>
    </div>
  </div>

  {/* Search & Invite Button */}
  <div className="w-full md:w-auto">
    <Button
      className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white"
      onClick={handleSearchAndInvite} 
      disabled={loading}
    >
      {loading ? "Searching..." : "Search & Invite"}
    </Button>
  </div>
</div>

      {/* Invited Creators Grid */}
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
              imageUrl: invited.creator.imageUrl || "/placeholder.svg", // Fallback image
              campaignId: invited.campaignId,
            }}
            isInvited={true}
            onRemove={handleRemoveCreator}
          />
        ))}
      </div>

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
  );
}
