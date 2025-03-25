import Image from "next/image"
import { MoreHorizontal, Award, ChevronRight } from "lucide-react"

interface CustomerCardProps {
  customerId: number
  rank: number
  customerName: string
  title: string
  profileImage: string
  totalPoints: number
  totalWon: number
  totalLost: number
}

// Function to determine background color based on rank
const getBackgroundColor = (rank: number): string => {
  switch (rank) {
    case 1:
      return "from-blue-200 to-blue-200"
    case 2:
      return "from-amber-200 to-amber-200"
    case 3:
      return "from-purple-200 to-pink-200"
    case 4:
      return "from-teal-200 to-teal-200"
    case 5:
      return "from-pink-200 to-pink-200"
    case 6:
      return "from-green-200 to-green-200"
    case 7:
      return "from-yellow-200 to-yellow-200"
    case 8:
      return "from-orange-200 to-orange-200"
    case 9:
      return "from-lime-200 to-lime-200"
    case 10:
      return "from-cyan-200 to-cyan-200"
    default:
      return "from-gray-200 to-gray-200"
  }
}


// Function to determine hover background color based on rank
const getHoverBackgroundColor = (rank: number): string => {
  switch (rank) {
    case 1:
      return "from-blue-200 to-blue-200"
    case 2:
      return "from-amber-200 to-amber-200"
    case 3:
      return "from-purple-200 to-pink-200"
    case 4:
      return "from-teal-200 to-teal-200"
    case 5:
      return "from-pink-200 to-pink-200"
    case 6:
      return "from-green-200 to-green-200"
    case 7:
      return "from-yellow-200 to-yellow-200"
    case 8:
      return "from-orange-200 to-orange-200"
    case 9:
      return "from-lime-200 to-lime-200"
    case 10:
      return "from-cyan-200 to-cyan-200"
    default:
      return "from-gray-200 to-gray-200"
  }
}

export function CustomerCard({ customerId, rank, customerName, title, totalPoints, totalWon, totalLost, profileImage }: CustomerCardProps) {
  const bgGradient = getBackgroundColor(rank)
  const hoverBgGradient = getHoverBackgroundColor(rank)
  console.log(customerId)
  return (
    <div
      className={`relative rounded-2xl bg-gradient-to-r ${bgGradient} ${hoverBgGradient} p-4 sm:p-6 shadow-md 
        hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-[1.02] cursor-pointer
        group overflow-hidden`}
    >
      {/* Decorative elements that appear on hover - hidden on mobile */}
      <div className="absolute -right-16 -bottom-16 opacity-0 group-hover:opacity-20 transition-opacity duration-300 hidden sm:block">
        <Award className="w-32 h-32 text-black" />
      </div>

      {/* Menu */}
      <button className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1 text-black/80 hover:text-black hover:bg-black/10 rounded-full transition-colors">
        <MoreHorizontal className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      {/* Mobile Layout */}
      <div className="flex flex-col sm:hidden">
        {/* Top row: Profile image, name, and ranking */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="mr-3">
              <div className="h-12 w-12 rounded-full overflow-hidden bg-white/20 border-2 border-transparent group-hover:border-white transition-all duration-300">
                <Image
                  src={profileImage || "/placeholder.svg"}
                  alt={customerName}
                  width={48}
                  height={48}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-black">{customerName}</h3>
              <p className="text-sm text-black/80">Title: {title}</p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-3xl font-bold text-black">{rank}</p>
            <p className="text-xs text-black/80">Ranking</p>
          </div>
        </div>

        {/* Bottom row: Stats */}
        <div className="flex justify-between mt-2">
          <div className="text-center">
            <p className="text-xl font-bold text-black">{totalPoints.toLocaleString()}</p>
            <p className="text-xs text-black/80">Points</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-black">{totalWon.toLocaleString()}</p>
            <p className="text-xs text-black/80">Won</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-black">{totalLost.toLocaleString()}</p>
            <p className="text-xs text-black/80">Lost</p>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex sm:items-center">
        {/* Left section: Profile Image and Name/Title */}
        <div className="flex items-center w-1/3">
          <div className="mr-4">
            <div className="h-16 w-16 rounded-full overflow-hidden bg-white/20 border-2 border-transparent group-hover:border-white transition-all duration-300">
              <Image
                src={profileImage || "/placeholder.svg"}
                alt={customerName}
                width={64}
                height={64}
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-black group-hover:translate-x-1 transition-transform duration-300">
              {customerName}
            </h3>
            <p className="text-lg text-black/80 group-hover:translate-x-1 transition-transform duration-300 delay-75">
              Title: {title}
            </p>
          </div>
        </div>

        {/* Center section: Stats */}
        <div className="flex justify-center w-1/3 space-x-12">
          <div className="text-center group-hover:-translate-y-1 transition-transform duration-300">
            <p className="text-2xl font-bold text-black">{totalPoints.toLocaleString()}</p>
            <p className="text-base text-black/80">Points</p>
          </div>
          <div className="text-center group-hover:-translate-y-1 transition-transform duration-300 delay-75">
            <p className="text-2xl font-bold text-black">{totalWon.toLocaleString()}</p>
            <p className="text-base text-black/80">Won</p>
          </div>
          <div className="text-center group-hover:-translate-y-1 transition-transform duration-300 delay-150">
            <p className="text-2xl font-bold text-black">{totalLost.toLocaleString()}</p>
            <p className="text-base text-black/80">Lost</p>
          </div>
        </div>

        {/* Right section: Ranking */}
        <div className="flex justify-end w-1/3">
          <div className="text-center relative">
            <p className="text-4xl font-bold text-black group-hover:scale-110 transition-transform duration-300">
              {rank}
            </p>
            <p className="text-base text-black/80">Ranking</p>

            {/* Arrow that appears on hover */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-6 transition-all duration-300">
              <ChevronRight className="h-6 w-6 text-black" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

