import { useState } from 'react';
import { Brain } from 'lucide-react';

export function ParticipationRules() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="border border-gray-300 rounded-lg p-4">
      {/* Flex container to align title and "Know More" or "Less..." */}
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-lg mb-4">How to participate?</h2>

        {/* Show "Know More" when collapsed */}
        {!isExpanded && (
          <button
            onClick={toggleExpand}
            className="text-blue-500 font-semibold flex items-center"
          >
            <Brain className="h-4 w-4 mr-2" /> Know More
          </button>
        )}

        {/* Show "Less..." when expanded */}
        {isExpanded && (
          <button
            onClick={toggleExpand}
            className="text-blue-500 font-semibold"
          >
            Less...
          </button>
        )}
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="mt-4">
          <ul className="list-disc pl-5 space-y-1">
            <li>Log in to participate and predict the outcome of each game.</li>
            <li>Predict correctly - earn 50 points</li>
            <li>Incorrect prediction - lose 20 points</li>
            <li>Top 3 will get Gift Vouchers</li>
            <li>Participation voucher also there. So why waiting. <b>Let&apos;s Predict</b> 🚀 🚀 🚀</li>
          </ul>
        </div>
      )}
    </div>
  );
}
