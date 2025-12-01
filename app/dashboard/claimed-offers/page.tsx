'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Tag, Copy, CheckCircle } from 'lucide-react'

interface ClaimedOffer {
  id: string
  offer_id: string
  claimed_at: string
  offers: {
    title: string
    description: string
    category: string
    coupon_code: string | null
    expiry_date: string
    status: string
  }
}

export default function ClaimedOffers() {
  const [claimedOffers, setClaimedOffers] = useState<ClaimedOffer[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (user) {
      fetchClaimedOffers()
    }
  }, [user])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
    } else {
      setUser(user)
    }
  }

  const fetchClaimedOffers = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('claims')
      .select(`
        id,
        offer_id,
        claimed_at,
        offers (
          title,
          description,
          category,
          coupon_code,
          expiry_date,
          status
        )
      `)
      .eq('claimer_id', user.id)
      .order('claimed_at', { ascending: false })

    if (data) {
      setClaimedOffers(data as unknown as ClaimedOffer[])
    }
    setLoading(false)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const isExpired = (expiryDate: string) => {
    return new Date(expiryDate) < new Date()
  }

  const copyToClipboard = (text: string, offerId: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(offerId)
    setTimeout(() => setCopiedId(null), 2000)
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
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Claimed Offers</h1>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          You have claimed {claimedOffers.length} {claimedOffers.length === 1 ? 'offer' : 'offers'}
        </p>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : claimedOffers.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
              You haven't claimed any offers yet
            </p>
            <Link 
              href="/dashboard/browse-offers"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Browse Available Offers
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {claimedOffers.map(claim => {
              const offer = claim.offers
              const expired = isExpired(offer.expiry_date)

              return (
                <div
                  key={claim.id}
                  className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden ${
                    expired ? 'opacity-60' : ''
                  }`}
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(offer.category)}`}>
                        {offer.category}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        expired 
                          ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                          : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      }`}>
                        {expired ? 'Expired' : 'Active'}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold mb-2">{offer.title}</h3>
                    
                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {offer.description}
                    </p>

                    {/* Coupon Code */}
                    {offer.coupon_code && (
                      <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Coupon Code</p>
                        <div className="flex items-center justify-between">
                          <code className="text-lg font-mono font-bold text-blue-700 dark:text-blue-400">
                            {offer.coupon_code}
                          </code>
                          <button
                            onClick={() => copyToClipboard(offer.coupon_code!, claim.offer_id)}
                            className="p-2 hover:bg-blue-100 dark:hover:bg-blue-800 rounded transition"
                            title="Copy code"
                          >
                            {copiedId === claim.offer_id ? (
                              <CheckCircle size={20} className="text-green-600" />
                            ) : (
                              <Copy size={20} className="text-blue-600 dark:text-blue-400" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Footer Info */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-500">
                        <Calendar size={16} />
                        <span>Expires: {formatDate(offer.expiry_date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-500">
                        <CheckCircle size={16} />
                        <span>Claimed: {formatDate(claim.claimed_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
