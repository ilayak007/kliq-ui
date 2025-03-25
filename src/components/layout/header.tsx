'use client'

import Link from "next/link"
import { User, LogOut, KeyRound } from "lucide-react"
import { motion, useAnimation } from "framer-motion"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from 'next/navigation'

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const pathname = usePathname()  // Get the current path
  const router = useRouter()

  const predictLetters = [
    { letter: 'P', color: 'bg-blue-300' },
    { letter: 'R', color: 'bg-indigo-300' },
    { letter: 'E', color: 'bg-purple-300' },
    { letter: 'D', color: 'bg-pink-300' },
    { letter: 'I', color: 'bg-rose-300' },
    { letter: 'C', color: 'bg-emerald-300' },
    { letter: 'T', color: 'bg-yellow-300' },
  ]

  const controls = useAnimation()

  // Check if the user is logged in by inspecting localStorage
  const checkLoginStatus = () => {
    const token = localStorage.getItem('authToken')
    const storedUsername = localStorage.getItem('customerName')
    
    if (token) {
      setIsLoggedIn(true)
      setUsername(storedUsername || '')
    } else {
      setIsLoggedIn(false)
      setUsername('')
    }
  }

  useEffect(() => {
    checkLoginStatus()  // Check login status on mount

    // Listen for changes in localStorage (can be done manually as React doesn't auto-update on localStorage changes)
    const handleStorageChange = () => checkLoginStatus()
    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, []) // Run once on mount

  // // Handle login functionality
  // const handleLogin = () => {
  //   // Example login logic: Set the token and username in localStorage
  //   localStorage.setItem('authToken', 'your-auth-token')
  //   localStorage.setItem('customerId', 'your-customer-id')
  //   localStorage.setItem('customerName', 'Your Username')

  //   // Update the state immediately after login
  //   setIsLoggedIn(true)
  //   setUsername('Your Username')

  //   // Redirect to home or dashboard after login
  //   router.push('/')
  // }

  // Handle logout functionality
  const handleLogout = () => {
    // Clear the localStorage
    localStorage.removeItem('authToken')
    localStorage.removeItem('customerId')
    localStorage.removeItem('customerName')

    // Update the state after logout
    setIsLoggedIn(false)
    setUsername('')

    // Redirect to the login page
    router.push('/login')
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      controls.start({
        x: Math.random() * 100 - 50,
        y: Math.random() * 80 - 40,
        rotate: Math.random() * 180 - 90,
        transition: { duration: 0.6 }
      });
  
      setTimeout(() => {
        controls.start({
          x: 0,
          y: 0,
          rotate: 0,
          transition: { duration: 0.6 }
        });
      }, 1000);
    }, 2000);
  
    return () => clearTimeout(timer);
  }, [controls]);
  

  return (
    <header className="fixed top-0 left-0 right-0 w-full bg-blue-900 text-white z-50 shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between relative z-10 flex-col sm:flex-row">

        {/* ✅ PREDICT Box as a link */}
        <Link href="/" className="flex items-center space-x-1 cursor-pointer mb-4 sm:mb-0">
          {predictLetters.map((item, index) => (
            <motion.span
              key={index}
              custom={index}
              animate={controls}
              initial={{ x: 0, y: 0, rotate: 0 }}
              className={`w-8 h-8 ${item.color} text-blue-900 font-bold rounded flex items-center justify-center shadow`}
            >
              {item.letter}
            </motion.span>
          ))}
        </Link>

        {/* ✅ Menu Links (Conditional) */}
        {isLoggedIn && pathname !== '/login' && (
          <div className="flex items-center space-x-6 text-sm sm:text-base">
            <Link href="/welcome" className="flex items-center hover:text-indigo-200 transition-colors">
              <User className="h-5 w-5 mr-2" />
              <span>Welcome {username}</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center hover:text-indigo-200 transition-colors"
            >
              <LogOut className="h-5 w-5 mr-2" />
              <span>Logout?</span>
            </button>

            <Link href="/change-password" className="flex items-center hover:text-indigo-200 transition-colors">
              <KeyRound className="h-5 w-5 mr-2" />
              <span>Change Password</span>
            </Link>
            
          </div>
        )}
      </div>
    </header>
  )
}
