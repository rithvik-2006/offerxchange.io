
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

    if (error) {
      console.error('We could not fetch the offers', error)
      setLoading(false)
      return
    }

    if (data) {
      setOffers(data)
      const uniqueCategories = [...new Set(data.map(offer => offer.category))]
      setCategories(uniqueCategories)
    }
    setLoading(false)
  }

  const applyFiltersAndSort = () => {
    let filtered = [...offers]

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(offer => offer.category === selectedCategory)
    }

    if (sortBy === 'expiry') {
      filtered.sort(
        (a, b) => new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime()
      )
    } else if (sortBy === 'newest') {
      filtered.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    }

    setFilteredOffers(filtered)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getDaysUntilExpiry = (expiryDate: string) => {
    const now = new Date()
    const expiry = new Date(expiryDate)
    const diffTime = expiry.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // just UI colors changed to match dark glossy theme
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

      {/* top nav */}
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
                Discover
              </span>
              <h1 className="text-lg font-semibold tracking-tight text-slate-50">
                Browse Offers
              </h1>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-xs text-slate-300">
            <Tag size={16} />
            <span className="uppercase tracking-[0.2em] text-slate-400">
              {filteredOffers.length} {filteredOffers.length === 1 ? 'offer' : 'offers'} live
            </span>
          </div>
        </div>
      </nav>

      {/* main */}
      <main className="flex-1 w-full">
        <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
          {/* hero + filters card */}
          <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            {/* hero text */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-300/80">
                Community savings
              </p>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-50">
                Find an offer that fits your next purchase.
              </h2>
              <p className="text-sm text-slate-400 max-w-xl">
                Filter by category, sort by expiry, and claim coupons shared by the community
                before they&apos;re gone.
              </p>
            </div>

            {/* filters card */}
            <div className="relative">
              <div className="pointer-events-none absolute inset-0 blur-2xl bg-violet-500/25" />
              <div className="relative rounded-3xl border border-white/10 bg-slate-900/70 px-5 py-5 shadow-[0_24px_60px_rgba(15,23,42,0.95)] backdrop-blur-2xl space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Filter size={18} className="text-violet-300" />
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                      Refine results
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {filteredOffers.length} matching offers
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {/* category filter */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400">
                      Category
                    </label>
                    <div className="relative">
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full appearance-none rounded-2xl border border-slate-700/80 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 outline-none shadow-[0_0_0_1px_rgba(15,23,42,0.9)] focus:border-violet-500/70 focus:shadow-[0_0_0_1px_rgba(139,92,246,0.8)] focus:ring-2 focus:ring-violet-500/60"
                      >
                        <option value="all" className="bg-slate-900">
                          All categories
                        </option>
                        {categories.map(cat => (
                          <option key={cat} value={cat} className="bg-slate-900">
                            {cat}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-500 text-xs">
                        ▾
                      </div>
                    </div>
                  </div>

                  {/* sort filter */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400">
                      <Clock size={16} />
                      Sort by
                    </label>
                    <div className="relative">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full appearance-none rounded-2xl border border-slate-700/80 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 outline-none shadow-[0_0_0_1px_rgba(15,23,42,0.9)] focus:border-violet-500/70 focus:shadow-[0_0_0_1px_rgba(139,92,246,0.8)] focus:ring-2 focus:ring-violet-500/60"
                      >
                        <option value="newest" className="bg-slate-900">
                          Newest first
                        </option>
                        <option value="expiry" className="bg-slate-900">
                          Expiring soon
                        </option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-500 text-xs">
                        ▾
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* offers grid */}
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="relative h-12 w-12">
                <div className="absolute inset-0 rounded-full border-4 border-violet-500/60 border-t-transparent animate-spin" />
                <div className="absolute inset-2 rounded-full bg-slate-900/80" />
              </div>
            </div>
          ) : filteredOffers.length === 0 ? (
            <div className="relative mx-auto max-w-xl rounded-3xl border border-white/10 bg-slate-900/70 px-8 py-12 text-center shadow-[0_24px_60px_rgba(15,23,42,0.95)] backdrop-blur-2xl">
              <div className="pointer-events-none absolute inset-x-12 -top-6 h-px bg-gradient-to-r from-transparent via-violet-500/70 to-transparent" />
              <p className="text-sm text-slate-400">
                No offers match your filters right now. Try changing the category or check again
                later — new coupons are added all the time.
              </p>
            </div>
          ) : (
            <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredOffers.map(offer => {
                const daysLeft = getDaysUntilExpiry(offer.expiry_date)
                const isExpiringSoon = daysLeft <= 3

                return (
                  <Link
                    key={offer.id}
                    href={`/dashboard/browse-offers/${offer.id}`}
                    className="group relative overflow-hidden rounded-3xl border border-white/5 bg-slate-900/70 px-5 py-5 shadow-[0_24px_60px_rgba(15,23,42,0.95)] backdrop-blur-2xl transition hover:border-violet-500/70 hover:shadow-[0_30px_90px_rgba(109,40,217,0.85)]"
                  >
                    {/* glow */}
                    <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br from-violet-500/35 via-fuchsia-500/30 to-sky-500/10 blur-3xl opacity-70 group-hover:opacity-100 transition" />

                    <div className="relative space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <span className={getCategoryColor(offer.category)}>
                          <Tag size={10} />
                          {offer.category}
                        </span>

                        {isExpiringSoon && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-rose-400/60 bg-rose-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-100">
                            <Clock size={10} />
                            {daysLeft}d left
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-slate-50 group-hover:text-violet-100 transition">
                          {offer.title}
                        </h3>
                        <p className="mt-2 text-sm text-slate-400 line-clamp-2">
                          {offer.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Expires {formatDate(offer.expiry_date)}</span>
                        <span className="inline-flex items-center font-medium text-violet-200 group-hover:translate-x-1 group-hover:text-violet-100 transition">
                          View details
                          <span className="ml-1">→</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </section>
          )}
        </div>
      </main>
    </div>
  )
}
