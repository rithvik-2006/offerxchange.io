'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Tag, User, AlertCircle } from 'lucide-react'

interface Offer {
  reserved_by: any
  id: string
  title: string
  description: string
  category: string
  coupon_code: string | null
  expiry_date: string
  status: string
  owner_id: string
  created_at: string
}

interface Profile {
  name: string
  email: string
}

export default function OfferDetails() {
  const [offer, setOffer] = useState<Offer | null>(null)
  const [owner, setOwner] = useState<Profile | null>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const router = useRouter()
  const params = useParams()
  const offerId = params.id as string

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (user) {
      fetchOffer()
    }
  }, [user, offerId])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
    } else {
      setUser(user)
    }
  }

  const fetchOffer = async () => {
    setLoading(true)
    const { data: offerData, error } = await supabase
      .from('offers')
      .select('*')
      .eq('id', offerId)
      .single()

    if (offerData) {
      setOffer(offerData)
      
      // Fetch owner details
      const { data: profileData } = await supabase
        .from('profiles')
        .select('name, email')
        .eq('id', offerData.owner_id)
        .single()
      
      if (profileData) {
        setOwner(profileData)
      }
    }
    setLoading(false)
  }

  const handleClaim = async () => {
    if (!user || !offer) return

    // Check if user is trying to claim their own offer
    if (offer.owner_id === user.id) {
      setMessage({ type: 'error', text: 'You cannot claim your own offer!' })
      return
    }

    setClaiming(true)
    setMessage(null)

    try {
      // Atomic reservation
      const { data: reserved, error: reserveError } = await supabase
        .from('offers')
        .update({ 
          status: 'reserved', 
          reserved_by: user.id, 
          reserved_at: new Date().toISOString() 
        })
        .eq('id', offerId)
        .eq('status', 'available')
        .select()

      if (reserveError || !reserved || reserved.length === 0) {
        setMessage({ type: 'error', text: 'This offer has already been claimed by someone else!' })
        setClaiming(false)
        // Refresh offer data
        fetchOffer()
        return
      }

      // Create claim record
      const { error: claimError } = await supabase
        .from('claims')
        .insert({ offer_id: offerId, claimer_id: user.id })

      if (claimError) throw claimError

      // Mark as claimed
      await supabase
        .from('offers')
        .update({ status: 'claimed' })
        .eq('id', offerId)
        .eq('reserved_by', user.id)

      setMessage({ type: 'success', text: 'Offer claimed successfully! Redirecting...' })
      
      setTimeout(() => {
        router.push('/dashboard/claimed-offers')
      }, 2000)

    } catch (error) {
      console.error('Claim error:', error)
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' })
      setClaiming(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    )
  }

  if (!offer) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">Offer not found</p>
          <Link href="/dashboard/browse-offers" className="text-blue-600 hover:underline">
            Back to Browse
          </Link>
        </div>
      </div>
    )
  }

  const isExpired = new Date(offer.expiry_date) < new Date()
  const canClaim = offer.status === 'available' && !isExpired && offer.owner_id !== user?.id

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-sm p-4">
        <div className="container mx-auto flex items-center gap-4">
          <Link href="/dashboard/browse-offers" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Offer Details</h1>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          {/* Status Badge */}
          {offer.status !== 'available' && (
            <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-yellow-800 dark:text-yellow-300 font-semibold">
                This offer is no longer available
              </p>
            </div>
          )}

          {/* Message Alert */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              message.type === 'success' 
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300'
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
            }`}>
              <AlertCircle size={20} />
              <p className="font-semibold">{message.text}</p>
            </div>
          )}

          {/* Category */}
          <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full text-sm font-semibold mb-4">
            {offer.category}
          </span>

          {/* Title */}
          <h2 className="text-3xl font-bold mb-4">{offer.title}</h2>

          {/* Description */}
          <p className="text-gray-700 dark:text-gray-300 text-lg mb-6 leading-relaxed">
            {offer.description}
          </p>

          {/* Details Grid */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Calendar className="text-blue-600 dark:text-blue-400" size={24} />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Expires On</p>
                <p className="font-semibold">{formatDate(offer.expiry_date)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <User className="text-blue-600 dark:text-blue-400" size={24} />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Shared By</p>
                <p className="font-semibold">{owner?.name || owner?.email || 'Anonymous'}</p>
              </div>
            </div>
          </div>

          {/* Coupon Code (if available) */}
          {offer.coupon_code && offer.status === 'claimed' && offer.reserved_by === user?.id && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Coupon Code</p>
              <p className="text-2xl font-mono font-bold text-green-700 dark:text-green-400">
                {offer.coupon_code}
              </p>
            </div>
          )}

          {/* Claim Button */}
          {canClaim && (
            <button
              onClick={handleClaim}
              disabled={claiming}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-4 rounded-lg text-lg transition duration-200"
            >
              {claiming ? 'Claiming...' : 'Claim This Offer'}
            </button>
          )}

          {!canClaim && offer.owner_id === user?.id && (
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
              <p className="text-gray-600 dark:text-gray-400">This is your own offer</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
