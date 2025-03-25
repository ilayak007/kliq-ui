import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-blue-900 text-white">
      <div className="container mx-auto px-4 py-4"> {/* Reduced py-4 */}
        {/* Optional Grid content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Add content if needed */}
        </div>

        <div className="mt-4 pt-4 border-t border-indigo-800 text-center"> {/* Reduced mt-4 and pt-4 */}
          <p className="text-xs">&copy; {new Date().getFullYear()} @ilaya. All rights reserved.</p>

          <nav className="mt-2 flex justify-center space-x-4" aria-label="Footer Navigation"> {/* Reduced space-x */}
            <Link href="/privacy" className="text-xs hover:text-indigo-200 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs hover:text-indigo-200 transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-xs hover:text-indigo-200 transition-colors">
              Cookie Policy
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
