'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Star } from 'lucide-react'

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

  const pointsEarnedBgColor =
    data.totalPointsEarned >= 0 ? 'bg-green-200' : 'bg-red-200'

  // ✅ One-liner logic
  const earnedText
   =
    data.totalPredicted >= 15 && data.position > 3
      ? '₹500 Participation Reward'
      : (data.totalPredicted >= 10 && data.totalPredicted < 15) && data.position > 3
      ? '₹250 Participation Reward'
      : data.totalPredicted == 8
      ? 'Predict 2 more matches to win ₹250'
      : data.totalPredicted == 13
      ? 'Predict 2 more matches to win ₹500'
      : ''

  return (
    <div>
      {/* ✅ Mobile View */}
      <div className="flex flex-col gap-2 sm:hidden">
        {/* First row - Predicted, Won, Lost */}
        <div className="flex gap-2">
          <div className="bg-gray-100 p-4 rounded-lg flex flex-col items-center justify-center flex-1">
            <span className="text-sm text-gray-600">Predicted</span>
            <span className="text-2xl font-bold">{data.totalPredicted}</span>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg flex flex-col items-center justify-center flex-1">
            <span className="text-sm text-gray-600">Won</span>
            <span className="text-2xl font-bold">{data.totalWon}</span>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg flex flex-col items-center justify-center flex-1">
            <span className="text-sm text-gray-600">Lost</span>
            <span className="text-2xl font-bold">{data.totalLost}</span>
          </div>
        </div>

        {/* Second row - Points Earned and Your Position */}
        <div className="flex gap-2">
          <div
            className={`${pointsEarnedBgColor} p-4 rounded-lg flex flex-col items-center justify-center flex-1`}
          >
            <span className="text-sm text-gray-600">Points Earned</span>
            <span className="text-2xl font-bold">{animatedPoints}</span>
          </div>

          {/* ✅ Keep card and earned text separate */}
          <div className="flex flex-col items-center flex-1">
            <Link
              href={'/customer-ranking'}
              className="bg-blue-200 p-4 rounded-lg flex flex-col items-center justify-center hover:bg-blue-300 transition-colors relative w-full"
            >
              {data.position >= 1 && data.position <= 3 && (
                <Star
                  className={`absolute top-2 right-2 w-6 h-6 ${
                    data.position === 1
                      ? 'text-yellow-500'
                      : data.position === 2
                      ? 'text-gray-400'
                      : 'text-amber-700'
                  }`}
                  fill="currentColor"
                />
              )}
              <span className="text-sm text-gray-600">Your Position</span>
              <span className="text-2xl font-bold">
                {data.totalPredicted === 0 ? '?' : data.position}
              </span>
            </Link>

            
          </div>
          
        </div>
        {/* ✅ This is now outside the card */}
        {earnedText
             && (
              <span className="mt-1 text-sm font-medium text-green-700">
                {earnedText}
              </span>
            )}
      </div>

      {/* ✅ Desktop View */}
      <div className="hidden sm:grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-2">
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

        <div
          className={`${pointsEarnedBgColor} p-4 rounded-lg flex flex-col items-center justify-center`}
        >
          <span className="text-sm text-gray-600">Points Earned</span>
          <span className="text-4xl font-bold">{animatedPoints}</span>
        </div>

        {/* ✅ Keep card and earned text separate */}
        <div className="flex flex-col items-center">
          <Link
            href={'/customer-ranking'}
            className="bg-blue-200 p-4 rounded-lg flex flex-col items-center justify-center hover:bg-blue-300 transition-colors relative w-full"
          >
            {data.position >= 1 && data.position <= 3 && (
              <Star
                className={`absolute top-2 right-2 w-6 h-6 ${
                  data.position === 1
                    ? 'text-yellow-500'
                    : data.position === 2
                    ? 'text-gray-400'
                    : 'text-amber-700'
                }`}
                fill="currentColor"
              />
            )}
            <span className="text-sm text-gray-600">Your Position</span>
            <span className="text-4xl font-bold">
              {data.totalPredicted === 0 ? '?' : data.position}
            </span>
          </Link>

          
        </div>
        {/* ✅ This is now outside the card */}
        {earnedText && (
            <span className="mt-2 text-sm font-medium text-green-700 whitespace-nowrap animate-blinkOnce">
              {earnedText}
            </span>
          )}
      </div>
    </div>
  )
}
