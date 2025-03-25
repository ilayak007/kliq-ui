"use client"

import { type ReactNode, useEffect, useState } from "react"
import { Header } from "./header"
import { Footer } from "./footer"
import { AuthProvider } from '../context/AuthContext'

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const [headerHeight, setHeaderHeight] = useState(0)

  // Measure header height after component mounts
  useEffect(() => {
    const header = document.querySelector("header")
    if (header) {
      const height = header.offsetHeight
      setHeaderHeight(height)
    }

    // Update header height on window resize
    const handleResize = () => {
      const header = document.querySelector("header")
      if (header) {
        const height = header.offsetHeight
        setHeaderHeight(height)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
    <AuthProvider>
      <Header />
      <main
        className="flex-grow mb-16" // Added margin-bottom for space between main and footer
        style={{ paddingTop: `${headerHeight}px` }}
      >
        {children}
      </main>
      <Footer />
      </AuthProvider>
    </div>
  )
}

