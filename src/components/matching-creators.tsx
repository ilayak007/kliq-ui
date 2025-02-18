export function MatchingCreators() {
    return (
      <section className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-indigo-900/50 flex items-center justify-center">
            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Matching Creators</h2>
            <p className="text-sm text-gray-400">We are matching the best creators for your campaign</p>
          </div>
        </div>
      </section>
    )
  }
  
  