import Link from 'next/link'
import { Gift, Users, Shield } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <nav className="p-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Xchange</h1>
        <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
          Login
        </Link>
      </nav>

      <main className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold mb-6">Share Coupons, Save Money</h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
          Don't let your unused coupons expire. Share them with others and claim offers you need.
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-16">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <Gift className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Share Offers</h3>
            <p className="text-gray-600 dark:text-gray-400">Post unused coupons before they expire</p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Browse & Claim</h3>
            <p className="text-gray-600 dark:text-gray-400">Find offers that save you money</p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Secure Claims</h3>
            <p className="text-gray-600 dark:text-gray-400">One claim per offer guaranteed</p>
          </div>
        </div>
      </main>
    </div>
  )
}
