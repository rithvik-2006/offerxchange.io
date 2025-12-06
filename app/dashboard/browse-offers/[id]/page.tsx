
'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Tag, User, AlertCircle, Gift } from 'lucide-react'
import { claimOffer } from '@/app/actions/claimOffer'

interface Offer {
  id: string
  title: string
  description: string
  category: string
  coupon_code: string | null
  expiry_date: string
  status: string
  owner_id: string
  created_at: string
  reserved_by?: string | null
  reserved_at?: string | null
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
    const { data: offerData } = await supabase
      .from('offers')
      .select('*')
      .eq('id', offerId)
      .single()

    if (offerData) {
      setOffer(offerData as Offer)

      const { data: profileData } = await supabase
        .from('profiles')
        .select('name, email')
        .eq('id', offerData.owner_id)
        .single()

      if (profileData) {
        setOwner(profileData as Profile)
      }
    }
    setLoading(false)
  }

  const handleClaim = async () => {
    if (!user || !offer) return

    if (offer.owner_id === user.id) {
      setMessage({ type: 'error', text: 'You cannot claim your own offer!' })
      return
    }

    setClaiming(true)
    setMessage(null)

    try {
      const result = await claimOffer(offerId, user.id)

      if (!result.success) {
        setMessage({ type: 'error', text: result.message })
        await fetchOffer()
        setClaiming(false)
        return
      }

      setMessage({ type: 'success', text: result.message + ' Redirecting...' })

      await fetchOffer()

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
      <div className="relative min-h-screen bg-slate-950 flex items-center justify-center">
        <div
          className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.25),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(56,189,248,0.18),_transparent_55%)]"
          aria-hidden="true"
        />
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-4 border-violet-500/70 border-t-transparent animate-spin" />
          <div className="absolute inset-2 rounded-full bg-slate-900/90" />
        </div>
      </div>
    )
  }

  if (!offer) {
    return (
      <div className="relative min-h-screen bg-slate-950 flex items-center justify-center text-slate-50">
        <div
          className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.25),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(56,189,248,0.18),_transparent_55%)]"
          aria-hidden="true"
        />
        <div className="max-w-md rounded-3xl border border-white/10 bg-slate-900/80 px-8 py-10 text-center shadow-[0_24px_60px_rgba(15,23,42,0.95)] backdrop-blur-2xl">
          <p className="text-lg text-slate-200 mb-4">Offer not found</p>
          <Link
            href="/dashboard/browse-offers"
            className="text-sm font-medium text-violet-200 hover:text-violet-100"
          >
            ← Back to Browse
          </Link>
        </div>
      </div>
    )
  }

  const isExpired = new Date(offer.expiry_date) < new Date()
  const canClaim = offer.status === 'available' && !isExpired && offer.owner_id !== user?.id
  const isClaimed = offer.status === 'claimed' && offer.reserved_by === user?.id

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      {/* background glows */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.25),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(56,189,248,0.18),_transparent_55%)]"
        aria-hidden="true"
      />

      {/* nav */}
      <nav className="border-b border-white/5 bg-slate-950/70 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/browse-offers"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-slate-900/70 p-2 hover:bg-slate-800 hover:border-violet-500/60 transition"
            >
              <ArrowLeft size={18} />
            </Link>
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
                Offer details
              </span>
              <h1 className="text-lg font-semibold tracking-tight text-slate-50">
                Xchange
              </h1>
            </div>
          </div>
        </div>
      </nav>

      {/* main */}
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="relative rounded-3xl border border-white/10 bg-slate-900/70 px-6 py-7 sm:px-10 sm:py-10 shadow-[0_24px_60px_rgba(15,23,42,0.95)] backdrop-blur-2xl space-y-6">
            <div className="pointer-events-none absolute inset-x-12 -top-px h-px bg-gradient-to-r from-transparent via-violet-500/70 to-transparent" />

            {/* status / info banners */}
            {offer.status !== 'available' && !isClaimed && (
              <div className="flex items-center gap-3 rounded-2xl border border-amber-400/60 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                <AlertCircle size={18} />
                <p className="font-medium">This offer is no longer available.</p>
              </div>
            )}

            {isClaimed && (
              <div className="flex items-center gap-3 rounded-2xl border border-emerald-400/60 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                <AlertCircle size={18} />
                <p className="font-medium">You have successfully claimed this offer!</p>
              </div>
            )}

            {message && (
              <div
                className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm ${
                  message.type === 'success'
                    ? 'border-emerald-400/60 bg-emerald-500/10 text-emerald-100'
                    : 'border-rose-400/60 bg-rose-500/10 text-rose-100'
                }`}
              >
                <AlertCircle size={18} />
                <p className="font-medium">{message.text}</p>
              </div>
            )}

            {/* header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="absolute inset-0 blur-xl bg-violet-500/35" />
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-indigo-500">
                    <Gift className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div>
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full border border-violet-400/60 bg-violet-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-100">
                      <Tag size={10} />
                      {offer.category}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-slate-600/70 bg-slate-800/80 px-3 py-1 text-[11px] text-slate-300">
                      <Calendar size={10} />
                      Expires {formatDate(offer.expiry_date)}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-50">
                    {offer.title}
                  </h2>
                </div>
              </div>

              <div className="text-sm text-slate-300">
                <span className="block text-[11px] uppercase tracking-[0.22em] text-slate-500 mb-1">
                  Shared by
                </span>
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/80 px-3 py-2">
                  <User size={16} className="text-violet-300" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-100">
                      {owner?.name || owner?.email || 'Anonymous'}
                    </span>
                    <span className="text-[11px] text-slate-500 truncate max-w-[180px]">
                      {owner?.email}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* description */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Description
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed">
                {offer.description}
              </p>
            </div>

            {/* details + coupon */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Offer details
                </h3>
                <div className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-4 text-xs text-slate-300 space-y-2">
                  <p>
                    Status:{' '}
                    <span className="font-medium capitalize text-slate-100">
                      {offer.status}
                    </span>
                  </p>
                  <p>
                    Created on{' '}
                    <span className="font-medium text-slate-100">
                      {formatDate(offer.created_at)}
                    </span>
                  </p>
                  <p>
                    Expires on{' '}
                    <span className="font-medium text-slate-100">
                      {formatDate(offer.expiry_date)}
                    </span>
                  </p>
                </div>

                {offer.owner_id === user?.id && (
                  <div className="rounded-2xl border border-slate-600/70 bg-slate-800/80 px-4 py-3 text-xs text-slate-300 text-center">
                    This is your own offer.
                  </div>
                )}

                {isExpired && (
                  <div className="rounded-2xl border border-rose-400/70 bg-rose-500/10 px-4 py-3 text-xs font-medium text-rose-100 text-center">
                    This offer has expired.
                  </div>
                )}
              </div>

              {/* Coupon code only when claimed by this user and coupon exists */}
              {offer.coupon_code && isClaimed && (
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Your coupon code
                  </h3>
                  <div className="rounded-2xl border border-emerald-400/70 bg-gradient-to-r from-emerald-500/15 via-violet-500/15 to-sky-500/15 px-4 py-5 shadow-[0_18px_45px_rgba(16,185,129,0.55)]">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-2xl font-mono font-bold text-emerald-100 break-all">
                        {offer.coupon_code}
                      </p>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(offer.coupon_code!)
                          setMessage({ type: 'success', text: 'Coupon code copied!' })
                          setTimeout(() => setMessage(null), 2000)
                        }}
                        className="rounded-2xl bg-emerald-500/90 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-emerald-400 transition"
                      >
                        Copy
                      </button>
                    </div>
                    <p className="mt-2 text-[11px] text-emerald-50/80">
                      Keep this code safe and use it according to the offer&apos;s terms.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* claim button + info */}
            <div className="pt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              {canClaim && (
                <button
                  onClick={handleClaim}
                  disabled={claiming}
                  className="w-full sm:w-auto rounded-2xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(109,40,217,0.75)] transition hover:brightness-110 hover:shadow-[0_22px_55px_rgba(109,40,217,0.9)] disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
                >
                  {claiming ? 'Claiming...' : 'Claim This Offer'}
                </button>
              )}

              {!canClaim && !isClaimed && offer.owner_id === user?.id && (
                <div className="w-full sm:w-auto rounded-2xl border border-slate-600/70 bg-slate-800/80 px-4 py-3 text-center text-xs text-slate-300">
                  This is your own offer.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}