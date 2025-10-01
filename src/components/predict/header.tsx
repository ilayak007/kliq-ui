import Link from "next/link";

interface HeaderProps {
  tournamentName?: string;
  tournamentId?: string;
  tournamentDescription?: string;
}

export function Header({ tournamentName = "Tournament Challenge", tournamentId , tournamentDescription ="test" }: HeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-2 flex-wrap">
      {/* IPL Challenge Section */}
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className="w-18 h-10 flex items-center justify-center">
          <div className="w-24 h-16 mb-2 overflow-hidden rounded-md">
            <img
              src={tournamentId ? `https://kliq-demo-images.s3.eu-north-1.amazonaws.com/${tournamentId}.jpg` : "https://kliq-demo-images.s3.eu-north-1.amazonaws.com/asia-cup-1.jpg"}
              alt={tournamentName}
              width={96}
              height={64}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold">{tournamentName}</h1>
          <p className="text-sm text-gray-600">{tournamentDescription}</p>
        </div>
      </div>

      {/* Rankings Section with Link */}
    <div className="ml-auto flex flex-row items-center gap-4 w-full sm:w-auto">
      {/* Profile Message */}
      <Link href="/profile-message" className="w-1/2 sm:w-auto">
        <div className="bg-blue-300 p-4 rounded-lg flex items-center justify-center cursor-pointer hover:bg-blue-400 transition-all w-full">
          <span className="text-sm text-black-800">Profile Message</span>
        </div>
      </Link>

      <Link href="/customer-ranking" className="w-1/2 sm:w-auto">
        <div className="bg-purple-300 p-4 rounded-lg flex items-center justify-center cursor-pointer hover:bg-purple-400 transition-all w-full">
          <span className="text-sm text-black-800">Check Rankings</span>
        </div>
      </Link>
    </div>

    </div>
  );
}
