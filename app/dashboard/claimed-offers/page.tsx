// 'use client'
// import { useEffect, useState } from 'react'
// import { supabase } from '@/lib/supabase'
// import { useRouter } from 'next/navigation'
// import Link from 'next/link'
// import { ArrowLeft, Calendar, Tag, Copy, CheckCircle } from 'lucide-react'

// interface ClaimedOffer {
//   id: string
//   offer_id: string
//   claimed_at: string
//   offers: {
//     title: string
//     description: string
//     category: string
//     coupon_code: string | null
//     expiry_date: string
//     status: string
//   }
// }

// export default function ClaimedOffers() {
//   const [claimedOffers, setClaimedOffers] = useState<ClaimedOffer[]>([])
//   const [loading, setLoading] = useState(true)
//   const [user, setUser] = useState<any>(null)
//   const [copiedId, setCopiedId] = useState<string | null>(null)
//   const router = useRouter()

//   useEffect(() => {
//     checkUser()
//   }, [])

//   useEffect(() => {
//     if (user) {
//       fetchClaimedOffers()
//     }
//   }, [user])

//   const checkUser = async () => {
//     const { data: { user } } = await supabase.auth.getUser()
//     if (!user) {
//       router.push('/login')
//     } else {
//       setUser(user)
//     }
//   }

//   const fetchClaimedOffers = async () => {
//     setLoading(true)
//     const { data, error } = await supabase
//       .from('claims')
//       .select(`
//         id,
//         offer_id,
//         claimed_at,
//         offers (
//           title,
//           description,
//           category,
//           coupon_code,
//           expiry_date,
//           status
//         )
//       `)
//       .eq('claimer_id', user.id)
//       .order('claimed_at', { ascending: false })

//     if (data) {
//       setClaimedOffers(data as unknown as ClaimedOffer[])
//     }
//     setLoading(false)
//   }

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString)
//     return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
//   }

//   const isExpired = (expiryDate: string) => {
//     return new Date(expiryDate) < new Date()
//   }

//   const copyToClipboard = (text: string, offerId: string) => {
//     navigator.clipboard.writeText(text)
//     setCopiedId(offerId)
//     setTimeout(() => setCopiedId(null), 2000)
//   }

//   const getCategoryColor = (category: string) => {
//     const colors: { [key: string]: string } = {
//       food: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
//       travel: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
//       shopping: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
//       'bill payments': 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
//       entertainment: 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300',
//       default: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
//     }
//     return colors[category.toLowerCase()] || colors.default
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
//       <nav className="bg-white dark:bg-gray-800 shadow-sm p-4">
//         <div className="container mx-auto flex items-center gap-4">
//           <Link href="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">
//             <ArrowLeft size={24} />
//           </Link>
//           <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Claimed Offers</h1>
//         </div>
//       </nav>

//       <main className="container mx-auto px-4 py-8">
//         <p className="text-gray-600 dark:text-gray-400 mb-6">
//           You have claimed {claimedOffers.length} {claimedOffers.length === 1 ? 'offer' : 'offers'}
//         </p>

//         {loading ? (
//           <div className="text-center py-12">
//             <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
//           </div>
//         ) : claimedOffers.length === 0 ? (
//           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
//             <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
//               You haven't claimed any offers yet
//             </p>
//             <Link 
//               href="/dashboard/browse-offers"
//               className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
//             >
//               Browse Available Offers
//             </Link>
//           </div>
//         ) : (
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {claimedOffers.map(claim => {
//               const offer = claim.offers
//               const expired = isExpired(offer.expiry_date)

//               return (
//                 <div
//                   key={claim.id}
//                   className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden ${
//                     expired ? 'opacity-60' : ''
//                   }`}
//                 >
//                   <div className="p-6">
//                     {/* Header */}
//                     <div className="flex items-start justify-between mb-3">
//                       <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(offer.category)}`}>
//                         {offer.category}
//                       </span>
//                       <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                         expired 
//                           ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
//                           : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
//                       }`}>
//                         {expired ? 'Expired' : 'Active'}
//                       </span>
//                     </div>

//                     {/* Title */}
//                     <h3 className="text-xl font-bold mb-2">{offer.title}</h3>
                    
//                     {/* Description */}
//                     <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
//                       {offer.description}
//                     </p>

//                     {/* Coupon Code */}
//                     {offer.coupon_code && (
//                       <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
//                         <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Coupon Code</p>
//                         <div className="flex items-center justify-between">
//                           <code className="text-lg font-mono font-bold text-blue-700 dark:text-blue-400">
//                             {offer.coupon_code}
//                           </code>
//                           <button
//                             onClick={() => copyToClipboard(offer.coupon_code!, claim.offer_id)}
//                             className="p-2 hover:bg-blue-100 dark:hover:bg-blue-800 rounded transition"
//                             title="Copy code"
//                           >
//                             {copiedId === claim.offer_id ? (
//                               <CheckCircle size={20} className="text-green-600" />
//                             ) : (
//                               <Copy size={20} className="text-blue-600 dark:text-blue-400" />
//                             )}
//                           </button>
//                         </div>
//                       </div>
//                     )}

//                     {/* Footer Info */}
//                     <div className="space-y-2 text-sm">
//                       <div className="flex items-center gap-2 text-gray-500 dark:text-gray-500">
//                         <Calendar size={16} />
//                         <span>Expires: {formatDate(offer.expiry_date)}</span>
//                       </div>
//                       <div className="flex items-center gap-2 text-gray-500 dark:text-gray-500">
//                         <CheckCircle size={16} />
//                         <span>Claimed: {formatDate(claim.claimed_at)}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )
//             })}
//           </div>
//         )}
//       </main>
//     </div>
//   )
// }


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
    const { data } = await supabase
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
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
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
      food: 'border-amber-400/60 bg-amber-500/10 text-amber-100',
      travel: 'border-sky-400/60 bg-sky-500/10 text-sky-100',
      shopping: 'border-fuchsia-400/60 bg-fuchsia-500/10 text-fuchsia-100',
      'bill payments': 'border-emerald-400/60 bg-emerald-500/10 text-emerald-100',
      entertainment: 'border-pink-400/60 bg-pink-500/10 text-pink-100',
      default: 'border-slate-500/60 bg-slate-700/40 text-slate-100'
    }
    return (
      'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ' +
      (colors[category.toLowerCase()] || colors.default)
    )
  }

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      {/* background glows */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.25),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(56,189,248,0.18),_transparent_55%)]"
        aria-hidden="true"
      />

      {/* nav */}
      <nav className="border-b border-white/5 bg-slate-950/70 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-slate-900/70 p-2 hover:bg-slate-800 hover:border-violet-500/60 transition"
            >
              <ArrowLeft size={18} />
            </Link>
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
                History
              </span>
              <h1 className="text-lg font-semibold tracking-tight text-slate-50">
                Claimed Offers
              </h1>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-xs text-slate-300">
            <CheckCircle size={16} />
            <span className="uppercase tracking-[0.2em] text-slate-400">
              {claimedOffers.length}{' '}
              {claimedOffers.length === 1 ? 'offer' : 'offers'}
            </span>
          </div>
        </div>
      </nav>

      {/* main */}
      <main className="flex-1 w-full">
        <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
          {/* header text */}
          <section className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-300/80">
              Saved rewards
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-50">
              All the offers you&apos;ve claimed in one place.
            </h2>
            <p className="text-sm text-slate-400 max-w-xl">
              You have claimed {claimedOffers.length}{' '}
              {claimedOffers.length === 1 ? 'offer' : 'offers'}. Copy codes quickly
              and check their expiry status at a glance.
            </p>
          </section>

          {/* states */}
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="relative h-12 w-12">
                <div className="absolute inset-0 rounded-full border-4 border-violet-500/70 border-t-transparent animate-spin" />
                <div className="absolute inset-2 rounded-full bg-slate-900/90" />
              </div>
            </div>
          ) : claimedOffers.length === 0 ? (
            <div className="relative mx-auto max-w-xl rounded-3xl border border-white/10 bg-slate-900/70 px-8 py-12 text-center shadow-[0_24px_60px_rgba(15,23,42,0.95)] backdrop-blur-2xl">
              <div className="pointer-events-none absolute inset-x-10 -top-px h-px bg-gradient-to-r from-transparent via-violet-500/70 to-transparent" />
              <p className="text-sm text-slate-300 mb-6">
                You haven&apos;t claimed any offers yet. Browse community deals and
                start building your list of rewards.
              </p>
              <Link
                href="/dashboard/browse-offers"
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(109,40,217,0.75)] transition hover:brightness-110 hover:shadow-[0_22px_55px_rgba(109,40,217,0.9)]"
              >
                Browse Available Offers
              </Link>
            </div>
          ) : (
            <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {claimedOffers.map(claim => {
                const offer = claim.offers
                const expired = isExpired(offer.expiry_date)

                return (
                  <div
                    key={claim.id}
                    className={`group relative overflow-hidden rounded-3xl border border-white/5 bg-slate-900/70 px-5 py-5 shadow-[0_24px_60px_rgba(15,23,42,0.95)] backdrop-blur-2xl transition ${
                      expired
                        ? 'opacity-60'
                        : 'hover:border-violet-500/70 hover:shadow-[0_30px_90px_rgba(109,40,217,0.85)]'
                    }`}
                  >
                    {/* glow */}
                    <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br from-violet-500/35 via-fuchsia-500/30 to-sky-500/10 blur-3xl opacity-60 group-hover:opacity-100 transition" />

                    <div className="relative space-y-4">
                      {/* header badges */}
                      <div className="flex items-start justify-between gap-3">
                        <span className={getCategoryColor(offer.category)}>
                          <Tag size={10} />
                          {offer.category}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                            expired
                              ? 'border-rose-400/70 bg-rose-500/10 text-rose-100'
                              : 'border-emerald-400/70 bg-emerald-500/10 text-emerald-100'
                          }`}
                        >
                          {expired ? 'Expired' : 'Active'}
                        </span>
                      </div>

                      {/* title & description */}
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-slate-50">
                          {offer.title}
                        </h3>
                        <p className="mt-2 text-sm text-slate-400 line-clamp-2">
                          {offer.description}
                        </p>
                      </div>

                      {/* coupon code */}
                      {offer.coupon_code && (
                        <div className="rounded-2xl border border-violet-400/60 bg-gradient-to-r from-violet-500/10 via-sky-500/10 to-emerald-500/10 px-3 py-3">
                          <p className="text-[11px] text-slate-300 mb-1">
                            Coupon code
                          </p>
                          <div className="flex items-center justify-between gap-2">
                            <code className="text-lg font-mono font-bold text-violet-100 break-all">
                              {offer.coupon_code}
                            </code>
                            <button
                              onClick={() =>
                                copyToClipboard(offer.coupon_code!, claim.offer_id)
                              }
                              className="flex items-center justify-center rounded-2xl border border-white/15 bg-slate-900/70 p-2 hover:border-violet-400/70 hover:bg-slate-800 transition"
                              title="Copy code"
                            >
                              {copiedId === claim.offer_id ? (
                                <CheckCircle size={18} className="text-emerald-400" />
                              ) : (
                                <Copy size={18} className="text-violet-200" />
                              )}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* footer info */}
                      <div className="space-y-1 text-xs text-slate-400">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          <span>Expires: {formatDate(offer.expiry_date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle size={14} />
                          <span>Claimed: {formatDate(claim.claimed_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </section>
          )}
        </div>
      </main>
    </div>
  )
}
