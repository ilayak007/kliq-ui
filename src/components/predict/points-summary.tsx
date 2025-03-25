'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

interface PointsSummaryProps {
  data: {
    totalPredicted: number
    totalWon: number
    totalLost: number
    totalPointsEarned: number
    position: number
  }
}

export function PointsSummary({ data }: PointsSummaryProps) {
  const [animatedPoints, setAnimatedPoints] = useState(0)

  useEffect(() => {
    let start = 0
    const end = data.totalPointsEarned
    const duration = 1000
    const incrementTime = 30
    const steps = Math.ceil(duration / incrementTime)
    const increment = end / steps

    const interval = setInterval(() => {
      start += increment
      if (start >= end) {
        setAnimatedPoints(end)
        clearInterval(interval)
      } else {
        setAnimatedPoints(Math.floor(start))
      }
    }, incrementTime)

    return () => clearInterval(interval)
  }, [data.totalPointsEarned])

  // Determine background color based on totalPointsEarned
  const pointsEarnedBgColor = data.totalPointsEarned >= 0 ? 'bg-green-200' : 'bg-red-200'
  const apiUrl = process.env.NEXT_PUBLIC_KLIQ_BACKEND_API_URL;
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-2">
      <div className="bg-gray-100 p-4 rounded-lg flex flex-col items-center justify-center">
        <span className="text-sm text-gray-600">Predicted</span>
        <span className="text-4xl font-bold">{data.totalPredicted}</span>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg flex flex-col items-center justify-center">
        <span className="text-sm text-gray-600">Won</span>
        <span className="text-4xl font-bold">{data.totalWon}</span>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg flex flex-col items-center justify-center">
        <span className="text-sm text-gray-600">Lost</span>
        <span className="text-4xl font-bold">{data.totalLost}</span>
      </div>

      {/* Dynamically applying background color for Points Earned */}
      <div className={`${pointsEarnedBgColor} p-4 rounded-lg flex flex-col items-center justify-center`}>
        <span className="text-sm text-gray-600">Points Earned</span>
        <span className="text-4xl font-bold">{animatedPoints}</span>
      </div>

      {/* ✅ Linked Position */}
      <Link
        href={`${apiUrl}/customer-ranking`}
        className="bg-blue-200 p-4 rounded-lg flex flex-col items-center justify-center hover:bg-blue-300 transition-colors"
      >
        <span className="text-sm text-gray-600">Your Position</span>
        <span className="text-4xl font-bold">{data.position}</span>
      </Link>
    </div>
  )
}
