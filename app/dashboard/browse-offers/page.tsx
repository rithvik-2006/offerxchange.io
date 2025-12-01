'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Filter, Clock, Tag, ArrowLeft } from 'lucide-react'

interface Offer {
  id: string
  title: string
  description: string
  category: string
  expiry_date: string
  status: string
  owner_id: string
  created_at: string
}

export default function BrowseOffers() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (user) {
      fetchOffers()
    }
  }, [user])

  useEffect(() => {
    applyFiltersAndSort()
  }, [selectedCategory, sortBy, offers])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
    } else {
      setUser(user)
    }
  }

  const fetchOffers = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .eq('status', 'available')
      .gte('expiry_date', new Date().toISOString())

    if (data) {
      setOffers(data)
      // Extract unique categories
      const uniqueCategories = [...new Set(data.map(offer => offer.category))]
      setCategories(uniqueCategories)
    }
    setLoading(false)
  }

  const applyFiltersAndSort = () => {
    let filtered = [...offers]

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(offer => offer.category === selectedCategory)
    }

    // Sort
    if (sortBy === 'expiry') {
      filtered.sort((a, b) => new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime())
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }

    setFilteredOffers(filtered)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const getDaysUntilExpiry = (expiryDate: string) => {
    const now = new Date()
    const expiry = new Date(expiryDate)
    const diffTime = expiry.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      food: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
      travel: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      shopping: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
      'bill payments': 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      entertainment: 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300',
      default: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
    }
    return colors[category.toLowerCase()] || colors.default
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-sm p-4">
        <div className="container mx-auto flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Browse Offers</h1>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {/* Filters and Sort */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Category Filter */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                <Filter size={18} />
                Filter by Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                <Clock size={18} />
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="expiry">Expiring Soon</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {filteredOffers.length} {filteredOffers.length === 1 ? 'offer' : 'offers'} available
        </p>

        {/* Offers Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : filteredOffers.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No offers available</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffers.map(offer => {
              const daysLeft = getDaysUntilExpiry(offer.expiry_date)
              const isExpiringSoon = daysLeft <= 3

              return (
                <Link
                  key={offer.id}
                  href={`/dashboard/browse-offers/${offer.id}`}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(offer.category)}`}>
                        {offer.category}
                      </span>
                      {isExpiringSoon && (
                        <span className="px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded-full text-xs font-semibold flex items-center gap-1">
                          <Clock size={12} />
                          {daysLeft}d left
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                      {offer.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {offer.description}
                    </p>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-500">
                        Expires: {formatDate(offer.expiry_date)}
                      </span>
                      <span className="text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-1 transition">
                        View →
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
