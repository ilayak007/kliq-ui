import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CreatorCard } from "@/components/creator-card";
import axios from "axios";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Users, ChevronLeft, ChevronRight } from "lucide-react";
interface Creator {
  id: string;
  name: string;
  city: string;
  country: string;
  followers: string;
  platforms: string[];
  imageUrl: string | null;
  imageKey: string | null;
  campaignId?: string; // ✅ Added to match expected CreatorCardProps
}

interface MatchingCreatorsProps {
  campaignId: string;
  isActive: boolean;
  matchingCreators: Creator[];
  setMatchingCreators: (creators: Creator[]) => void;
}

export function MatchingCreators({ campaignId, isActive, matchingCreators, setMatchingCreators }: MatchingCreatorsProps) {
  //const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);

    // Check scroll position to toggle arrow visibility
    const updateArrowVisibility = () => {
      const container = scrollContainerRef.current;
      if (container) {
        setShowLeftArrow(container.scrollLeft > 0);
        setShowRightArrow(container.scrollLeft + container.clientWidth < container.scrollWidth);
      }
    };
  
    // Handle scrolling left/right
    const scroll = (direction: "left" | "right") => {
      const container = scrollContainerRef.current;
      if (container) {
        const scrollAmount = 300;
        const newScroll = direction === "left" ? -scrollAmount : scrollAmount;
        container.scrollBy({ left: newScroll, behavior: "smooth" });
      }
    };

  const fetchCreators = async () => {
    if (!isActive) {
      setIsDialogOpen(true);
      return;
    }

    try {
      setLoading(true);
      setHasSearched(true);
      const apiUrl = process.env.NEXT_PUBLIC_KLIQ_BACKEND_API_URL;
      const response = await axios.get(`${apiUrl}/creators/top`, {
        params: { excludeCampaignId: campaignId },
      });

      setMatchingCreators(
        response.data.map((creator: Creator) => ({
          ...creator,
          campaignId, // ✅ Ensure campaignId is included before passing to CreatorCard
        }))
      );

      // Scroll page to Matching Creators section
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);

    } catch (error) {
      console.error("Error fetching creators:", error);
    } finally {
      setLoading(false);
    }
  };

    // Update arrow visibility on mount and when creators change
    useEffect(() => {
      updateArrowVisibility();
    }, [matchingCreators]);

  return (
       <section className="space-y-6 bg-zinc-900 p-6 rounded-lg" ref={sectionRef}>
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
                //onRemove={() => setCreators(creators.filter((c) => c.id !== creator.id))}
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
);
}
