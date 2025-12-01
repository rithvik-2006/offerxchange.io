'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PlusCircle, Search, Award, User, LogOut } from 'lucide-react'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [offerCount, setOfferCount] = useState(0)
  const router = useRouter()

  useEffect(() => {
    checkUser()
    getOfferCount()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) router.push('/login')
    else setUser(user)
  }

  const getOfferCount = async () => {
    const { count } = await supabase
      .from('offers')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'available')
    setOfferCount(count || 0)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Xchange</h1>
        <button onClick={handleLogout} className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-red-600">
          <LogOut size={20} /> Logout
        </button>
      </nav>

      <main className="container mx-auto px-4 py-12">
        <h2 className="text-4xl font-bold mb-2">Welcome back!</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-12">{offerCount} offers available to claim</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/dashboard/create-offer" className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
            <PlusCircle size={40} className="mb-4" />
            <h3 className="text-2xl font-bold">Create Offer</h3>
            <p className="text-blue-100 mt-2">Share an unused coupon</p>
          </Link>

          <Link href="/dashboard/browse-offers" className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
            <Search size={40} className="mb-4" />
            <h3 className="text-2xl font-bold">Browse Offers</h3>
            <p className="text-purple-100 mt-2">Find coupons to claim</p>
          </Link>

          <Link href="/dashboard/claimed-offers" className="bg-gradient-to-br from-green-500 to-green-600 text-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
            <Award size={40} className="mb-4" />
            <h3 className="text-2xl font-bold">Claimed Offers</h3>
            <p className="text-green-100 mt-2">View your claims</p>
          </Link>

          <Link href="/dashboard/profile" className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
            <User size={40} className="mb-4" />
            <h3 className="text-2xl font-bold">Profile</h3>
            <p className="text-orange-100 mt-2">Manage your account</p>
          </Link>
        </div>
      </main>
    </div>
  )
}
