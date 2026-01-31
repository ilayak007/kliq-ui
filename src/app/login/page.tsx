"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import axios from "axios"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Spinner } from "@/components/ui/spinner"

export default function WorldCupChallengePage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{ email?: string; password?: string; api?: string }>({})
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [flip, setFlip] = useState(false) // flip animation trigger
  const router = useRouter()
  const s3BaseUrl = "https://kliq-demo-images.s3.eu-north-1.amazonaws.com/"

  useEffect(() => {
    const authToken = localStorage.getItem("authToken")
    const customerId = localStorage.getItem("customerId")

    if (authToken && customerId) {
      router.push("/tournaments")
    }
  }, [router])

  // Countdown timer logic
  useEffect(() => {
    const targetDate = new Date("2026-02-07T11:00:00+05:30") // 9th Sep 2026 7:30 PM IST

    const interval = setInterval(() => {
      const now = new Date()
      const difference = targetDate.getTime() - now.getTime()

      if (difference <= 0) {
        clearInterval(interval)
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      } else {
        setTimeLeft(prev => {
          const newTime = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / (1000 * 60)) % 60),
            seconds: Math.floor((difference / 1000) % 60),
          }
          if (JSON.stringify(prev) !== JSON.stringify(newTime)) {
            setFlip(true)
            setTimeout(() => setFlip(false), 500) // reset flip
          }
          return newTime
        })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const validate = () => {
    const newErrors: typeof errors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!email) newErrors.email = "Email is required"
    else if (!emailRegex.test(email)) newErrors.email = "Invalid email format"

    if (!password) newErrors.password = "Password is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (!validate()) return

    setLoading(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_KLIQ_BACKEND_API_URL
      const response = await axios.post(`${apiUrl}/api/customer/login`, {
        email,
        password,
      })

      const { token, customer } = response.data
      const customerId = customer.customerId
      const customerName = customer.customerName

      localStorage.setItem("authToken", token)
      localStorage.setItem("customerId", customerId.toString())
      localStorage.setItem("customerName", customerName)

      router.push("/tournaments")
    } catch (err: unknown) {
      console.error("Login failed:", err)
      if (axios.isAxiosError(err)) {
        setErrors({ api: err.response?.data?.message || "Login failed. Please try again." })
      } else {
        setErrors({ api: "Login failed. Please try again." })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8] flex flex-col items-center px-4 py-4 max-w-6xl mx-auto">
      {/* Header with Countdown */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between mb-6">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h1 className="text-3xl md:text-4xl font-bold text-[#8B1538]">
          ICC Men&aposs T20 World Cup Challenge !!!
          </h1>
          <p className="text-gray-800 mt-1">
            Log in - Predict the winner - Earn points - Win vouchers
          </p>
        </div>

        {/* Countdown Timer */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Days", value: timeLeft.days },
            { label: "Hours", value: timeLeft.hours },
            { label: "Minutes", value: timeLeft.minutes },
            { label: "Seconds", value: timeLeft.seconds },
          ].map((item) => (
            <div
              key={item.label}
              className={`flex flex-col items-center justify-center w-20 h-16 sm:w-16 sm:h-16 rounded-lg shadow-md bg-gray-800 text-white transform transition-transform duration-500 ${
                flip ? "rotate-x-180" : ""
              }`}
            >
              <span className="text-xl sm:text-2xl font-bold">
                {item.value.toString().padStart(2, "0")}
              </span>
              <span className="text-xs sm:text-sm text-gray-300">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Banner */}
      <div className="w-full h-[150px] sm:h-[180px] md:h-[220px] mb-6 flex overflow-hidden rounded-lg">
        <div className="w-[30%] h-full flex">
          <div className="w-1/2 h-full relative">
            <Image
              src="https://kliq-demo-images.s3.eu-north-1.amazonaws.com/Marsh.jpg"
              alt="Kohli"
              fill
              className="object-cover"
            />
          </div>
          <div className="w-1/2 h-full relative">
            <Image
              src="https://kliq-demo-images.s3.eu-north-1.amazonaws.com/surya.jpg"
              alt="Rohit"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="w-[40%] h-full bg-[#8B1538] flex items-center justify-center">
          <div className="relative w-[95%] h-full mx-auto">
            <Image
              src="https://kliq-demo-images.s3.eu-north-1.amazonaws.com/t20-world-cup.jpg"
              alt="Asia Cup"
              fill
              className="object-cover rounded"
            />
          </div>
        </div>

        <div className="w-[30%] h-full flex">
          <div className="w-1/2 h-full relative">
            <Image
              src="https://kliq-demo-images.s3.eu-north-1.amazonaws.com/harry.jpg"
              alt="Dhoni"
              fill
              className="object-cover"
            />
          </div>
          <div className="w-1/2 h-full relative">
            <Image
              src="https://kliq-demo-images.s3.eu-north-1.amazonaws.com/Markram.jpg"
              alt="Cummins"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Login */}
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-3">Login</h2>
          {loading ? (
            <div className="flex justify-center py-6">
              <Spinner size={40} text="Logging In.." />
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`bg-gray-50 border ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`bg-gray-50 border ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password}</p>
                  )}
                </div>

                {errors.api && (
                  <p className="text-red-500 text-sm">{errors.api}</p>
                )}
                <Button
                  type="submit"
                  className="w-full bg-[#1E3A8A] hover:bg-[#152a62] text-white"
                >
                  Login
                </Button>
              </div>
            </form>
          )}

          <p className="text-sm text-center mt-3 text-gray-500">
            Don’t have an account?{" "}
            <button
              onClick={() => setShowModal(true)}
              className="text-[#8B1538] hover:underline"
            >
              Sign up
            </button>
          </p>
        </div>

        {/* How to participate */}
        <div>
          {/* <h2 className="text-l font-low mb-3 text-white bg-[#8B1538] p-2 rounded">
            How to participate?
          </h2>
          <ul className="space-y-1.5">
            <li>• Log-in to participate and predict the outcome of each game</li>
            <li>• Predict correctly - earn 50 points</li>
            <li>• Incorrect prediction - lose 20 points</li>
            <li>• Top 3 winners will get Gift Vouchers</li>
            <li>
              • Participation voucher also there. So why waiting. Let&apos;s
              Predict 🚀 🚀 🚀
            </li>
            <li> */}
            <img
                key=""
                src={`${s3BaseUrl}T20_WC_2026_flyer.png`}
                className="w-100 h-150 sm:w-50 sm:h-70 rounded border object-cover"
                alt=""
              />
            {/* </li>
          </ul> */}
        </div>
      </div>

      {/* Flags */}
      <div className="w-full mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-10 gap-x-6 justify-items-center">
          {["AFG", "AUS", "CAN", "ENG", "IND", "IRE", "ITA", "NAM", "NEP", "NED", "NZL", "OMN", "PAK", "SCO", "RSA", "SRI", "USA", "UAE", "WI", "ZIM"]
.map(
            (code, index) => (
              <img
                key={code}
                src={`${s3BaseUrl}${code}.jpg`}
                className={`w-20 h-14 sm:w-20 sm:h-14 rounded border object-cover 
                ${index === 4 ? "sm:mb-8" : ""}
                `}
                alt={`${code} flag`}
              />
            )
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md text-center">
            <h2 className="text-xl font-semibold mb-4">Registration</h2>
            <p className="mb-6">
              Please contact <span className="font-bold">Ilaya</span> for
              registration.
            </p>
            <Button
              onClick={() => setShowModal(false)}
              className="bg-[#1E3A8A] text-white w-full"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
