import Link from "next/link";

export function Header() {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-2 flex-wrap">
      {/* IPL Challenge Section */}
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className="w-18 h-10 flex items-center justify-center">
          <div className="w-24 h-16 mb-2 overflow-hidden rounded-md">
            <img
              src="https://kliq-demo-images.s3.eu-north-1.amazonaws.com/ipl.jpg"
              alt="ipl"
              width={96}
              height={64}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold">IPL Challenge</h1>
          <p className="text-sm text-gray-600">Log in - Predict the winner - Earn points - Win vouchers</p>
        </div>
      </div>

      {/* Rankings Section with Link */}
      <div className="ml-auto flex items-center gap-4 w-full sm:w-auto justify-end">
        <Link href="/customer-ranking">
          <div className="bg-purple-300 p-4 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-purple-400 transition-all w-full sm:w-auto">
            <span className="text-sm text-black-800">Check Rankings</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
