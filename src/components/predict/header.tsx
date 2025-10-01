import Link from "next/link";

interface HeaderProps {
  tournamentName?: string;
  tournamentId?: string;
  tournamentDescription?: string;
}

export function Header({ tournamentName = "Tournament Challenge", tournamentId , tournamentDescription ="test" }: HeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 px-4 py-2">
      {/* Tournament Section */}
      <div className="flex items-center gap-3 w-full lg:w-auto">
        <div className="flex-shrink-0">
          <div className="w-16 h-12 sm:w-20 sm:h-14 overflow-hidden rounded-md">
            <img
              src={tournamentId ? `https://kliq-demo-images.s3.eu-north-1.amazonaws.com/${tournamentId}.jpg` : "https://kliq-demo-images.s3.eu-north-1.amazonaws.com/asia-cup-1.jpg"}
              alt={tournamentName}
              width={80}
              height={56}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold truncate">{tournamentName}</h1>
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{tournamentDescription}</p>
        </div>
      </div>

      {/* Action Buttons Section */}
      <div className="flex flex-row items-center gap-2 w-full lg:w-auto">
        {/* Profile Message */}
        <Link href="/profile-message" className="flex-1 lg:flex-none">
          <div className="bg-blue-300 p-2 sm:p-3 rounded-lg flex items-center justify-center cursor-pointer hover:bg-blue-400 transition-all">
            <span className="text-xs sm:text-sm text-black font-medium">Profile Message</span>
          </div>
        </Link>

        {/* Check Rankings */}
        <Link href="/customer-ranking" className="flex-1 lg:flex-none">
          <div className="bg-purple-300 p-2 sm:p-3 rounded-lg flex items-center justify-center cursor-pointer hover:bg-purple-400 transition-all">
            <span className="text-xs sm:text-sm text-black font-medium">Check Rankings</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
