import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Kliq - Creator & Brand Collaborations",
  description: "Kliq - Creator & Brand Collaborations",
  icons: {
    icon: "/kliq-fav.png", // Ensure file is inside `public/`
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/kliq-fav.png" sizes="32x32" type="image/png" />
      </head>
      <body className={inter.className}>
        {children}
        {/* Toast container for notifications */}
        <ToastContainer position="bottom-right" autoClose={3000} />
      </body>
    </html>
  )
}
