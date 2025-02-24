/**
 * MatchingCreators Component
 * 
 * Description:
 * - Displays a list of creators that match the campaign's criteria.
 * - Allows the user to search for and invite matching creators to the campaign.
 * - Provides scrollable navigation for creator cards, with left/right arrows.
 * - Shows a dialog when the campaign is in draft status and prevents invites.
 * 
* @author Ilayaraja Kasirajan
 * @created [19-Feb-2025]
 * @lastModified [23-Feb-2025]
*/
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CreatorCard } from "@/components/creator-card";
import axios from "axios";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Users, ChevronLeft, ChevronRight } from "lucide-react";

// Interface representing a Creator object
interface Creator {
  id: string;
  name: string;
  city: string;
  country: string;
  followers: string;
  platforms: string[];
  imageUrl: string | null;
  imageKey: string | null;
  campaignId?: string; 
}

// Interface for MatchingCreators props
interface MatchingCreatorsProps {
  campaignId: string;
  isActive: boolean;
  matchingCreators: Creator[];
  setMatchingCreators: (creators: Creator[]) => void;
}

export function MatchingCreators({ campaignId, isActive, matchingCreators, setMatchingCreators }: MatchingCreatorsProps) {
  const [loading, setLoading] = useState(false); // Loading state for fetching creators
  const [hasSearched, setHasSearched] = useState(false); // Flag to track if search was done
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Dialog visibility state

  const [showLeftArrow, setShowLeftArrow] = useState(false); // State for left scroll arrow visibility
  const [showRightArrow, setShowRightArrow] = useState(false); // State for right scroll arrow visibility

  const scrollContainerRef = useRef<HTMLDivElement | null>(null); // Reference to the scrollable container
  const sectionRef = useRef<HTMLDivElement | null>(null); // Reference to the section for scrollIntoView

  // Function to check the scroll position and toggle arrow visibility
  const updateArrowVisibility = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setShowLeftArrow(container.scrollLeft > 0); // Show left arrow if scrolled
      setShowRightArrow(container.scrollLeft + container.clientWidth < container.scrollWidth); // Show right arrow if scrolled right
    }
  };

  // Function to handle scroll left/right actions
  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 300;
      const newScroll = direction === "left" ? -scrollAmount : scrollAmount; // Determine scroll direction
      container.scrollBy({ left: newScroll, behavior: "smooth" });
    }
  };

  // Function to fetch matching creators from the backend
  const fetchCreators = async () => {
    if (!isActive) { 
      // If campaign is inactive, show a dialog and return early
      setIsDialogOpen(true);
      return;
    }

    try {
      setLoading(true); // Set loading state
      setHasSearched(true); // Mark search as done
      const apiUrl = process.env.NEXT_PUBLIC_KLIQ_BACKEND_API_URL;
      const response = await axios.get(`${apiUrl}/creators/top`, {
        params: { excludeCampaignId: campaignId }, // Exclude creators already part of this campaign
      });

      // Set the fetched creators to the state with campaignId attached
      setMatchingCreators(
        response.data.map((creator: Creator) => ({
          ...creator,
          campaignId,
        }))
      );

      // Scroll to Matching Creators section after creators are set
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);

    } catch (error) {
      console.error("Error fetching creators:", error); // Log any errors
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Effect to update arrow visibility when matchingCreators change
  useEffect(() => {
    updateArrowVisibility();
  }, [matchingCreators]);

  return (
    <section className="space-y-6 bg-zinc-900 p-6 rounded-lg" ref={sectionRef}>
      {/* Matching Creators Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
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
          className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white"
          onClick={fetchCreators}
          disabled={loading}
        >
          {loading ? "Searching..." : "Search & Invite"}
        </Button>
      </div>

      {/* Display Matching Creators with Scroll and Arrows */}
      {matchingCreators.length > 0 ? (
        <div className="relative">
          {/* Left Arrow */}
          {showLeftArrow && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full shadow-lg z-10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Scrollable Creator Cards */}
          <div
            ref={scrollContainerRef}
            className="flex space-x-4 overflow-x-auto scrollbar-hide py-2"
            onScroll={updateArrowVisibility}
          >
            {matchingCreators.map((creator) => (
              <div key={creator.id} className="flex-shrink-0 w-64">
                <CreatorCard
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
                  onRemove={() => setMatchingCreators(matchingCreators.filter((c) => c.id !== creator.id))}
                />
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          {showRightArrow && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full shadow-lg z-10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      ) : (
        hasSearched && <p className="text-gray-400">No creators found.</p> // Display message when no creators are found
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
  );
}
