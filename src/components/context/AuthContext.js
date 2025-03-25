'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')

  // Check login status on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    const storedUsername = localStorage.getItem('customerName')
    
    if (token) {
      setIsLoggedIn(true)
      setUsername(storedUsername || '')
    }

    // Listen to changes in localStorage
    const handleStorageChange = () => {
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

    window.addEventListener('storage', handleStorageChange)

    // Cleanup listener on unmount
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const login = (username) => {
    localStorage.setItem('authToken', 'your-auth-token')
    localStorage.setItem('customerId', 'your-customer-id')
    localStorage.setItem('customerName', username)
    
    setIsLoggedIn(true)
    setUsername(username)
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('customerId')
    localStorage.removeItem('customerName')
    
    setIsLoggedIn(false)
    setUsername('')
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
