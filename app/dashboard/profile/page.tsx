'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Gift,
  Award,
  Trash2,
  AlertCircle,
  CheckCircle,
  Moon,
  Sun
} from 'lucide-react'
import { useTheme } from 'next-themes'

interface Profile {
  id: string
  name: string
  email: string
  avatar: string | null
  created_at: string
}

interface OfferStats {
  created: number
  claimed: number
  active: number
}

interface UserOffer {
  id: string
  title: string
  category: string
  status: string
  expiry_date: string
  created_at: string
}

export default function Profile() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [stats, setStats] = useState<OfferStats>({ created: 0, claimed: 0, active: 0 })
  const [userOffers, setUserOffers] = useState<UserOffer[]>([])
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [deletingOfferId, setDeletingOfferId] = useState<string | null>(null)
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (user) {
      fetchProfile()
      fetchStats()
      fetchUserOffers()
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

  const fetchProfile = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (data) {
      setProfile(data)
      setName(data.name || '')
    } else if (error && error.code === 'PGRST116') {
      const newProfile = {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.email?.split('@')[0],
        avatar: user.user_metadata?.avatar_url
      }

      await supabase.from('profiles').insert(newProfile)
      setProfile(newProfile as Profile)
      setName(newProfile.name)
    }
    setLoading(false)
  }

  const fetchStats = async () => {
    const { count: created } = await supabase
      .from('offers')
      .select('*', { count: 'exact', head: true })
      .eq('owner_id', user.id)

    const { count: active } = await supabase
      .from('offers')
      .select('*', { count: 'exact', head: true })
      .eq('owner_id', user.id)
      .eq('status', 'available')

    const { count: claimed } = await supabase
      .from('claims')
      .select('*', { count: 'exact', head: true })
      .eq('claimer_id', user.id)

    setStats({
      created: created || 0,
      claimed: claimed || 0,
      active: active || 0
    })
  }

  const fetchUserOffers = async () => {
    const { data } = await supabase
      .from('offers')
      .select('id, title, category, status, expiry_date, created_at')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)

    if (data) {
      setUserOffers(data)
    }
  }

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      setMessage({ type: 'error', text: 'Name cannot be empty' })
      return
    }

    setSaving(true)
    setMessage(null)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ name: name.trim() })
        .eq('id', user.id)

      if (error) throw error

      setProfile(prev => (prev ? { ...prev, name: name.trim() } : null))
      setEditMode(false)
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteOffer = async (offerId: string) => {
    if (!confirm('Are you sure you want to delete this offer? This action cannot be undone.')) {
      return
    }

    setDeletingOfferId(offerId)

    try {
      await supabase.from('claims').delete().eq('offer_id', offerId)

      const { error } = await supabase
        .from('offers')
        .delete()
        .eq('id', offerId)
        .eq('owner_id', user.id)

      if (error) throw error

      setMessage({ type: 'success', text: 'Offer deleted successfully' })
      fetchUserOffers()
      fetchStats()
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to delete offer' })
    } finally {
      setDeletingOfferId(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      available:
        'border-emerald-400/70 bg-emerald-500/10 text-emerald-100',
      claimed:
        'border-sky-400/70 bg-sky-500/10 text-sky-100',
      expired:
        'border-rose-400/70 bg-rose-500/10 text-rose-100',
      reserved:
        'border-amber-400/70 bg-amber-500/10 text-amber-100'
    }
    const base =
      'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.18em]'
    return `${base} ${badges[status] || badges.expired}`
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

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      {/* background glows */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_left,_rgba(139,92,246,0.42),_transparent_55%),radial-gradient(circle_at_bottom_right,_rgba(45,212,191,0.3),_transparent_55%)]"
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
                Account
              </span>
              <h1 className="text-lg font-semibold tracking-tight text-slate-50">
                Profile
              </h1>
            </div>
          </div>

          {/* theme toggle in nav */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/70 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-slate-300 hover:border-violet-500/70 hover:text-violet-100 hover:bg-slate-800 transition"
              title="Toggle theme"
            >
              {theme === 'dark' ? (
                <>
                  <Sun size={14} />
                  Light
                </>
              ) : (
                <>
                  <Moon size={14} />
                  Dark
                </>
              )}
            </button>
          )}
        </div>
      </nav>

      {/* main */}
      <main className="flex-1 w-full">
        <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
          {/* message alert */}
          {message && (
            <div
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm shadow-md ${
                message.type === 'success'
                  ? 'border-emerald-500/60 bg-emerald-500/12 text-emerald-100'
                  : 'border-rose-500/60 bg-rose-500/12 text-rose-100'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle size={18} />
              ) : (
                <AlertCircle size={18} />
              )}
              <p className="font-medium">{message.text}</p>
            </div>
          )}

          {/* profile + stats card */}
          <section className="relative rounded-3xl border border-white/10 bg-slate-900/80 px-6 py-7 sm:px-10 sm:py-9 shadow-[0_24px_60px_rgba(15,23,42,0.95)] backdrop-blur-2xl">
            <div className="pointer-events-none absolute inset-x-12 -top-px h-px bg-gradient-to-r from-transparent via-violet-500/70 to-transparent" />

            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              {/* avatar + basic info */}
              <div className="flex items-start gap-5">
                <div className="relative">
                  <div className="absolute inset-0 blur-xl bg-violet-500/45" />
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-indigo-500 text-3xl font-bold text-white shadow-lg shadow-violet-500/60">
                    {profile?.name
                      ? profile.name[0].toUpperCase()
                      : profile?.email[0].toUpperCase()}
                  </div>
                </div>

                <div className="space-y-2">
                  {editMode ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full max-w-xs rounded-xl border border-slate-600/80 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none focus:border-violet-500/80 focus:ring-2 focus:ring-violet-500/70"
                        placeholder="Your name"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveProfile}
                          disabled={saving}
                          className="rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 px-4 py-1.5 text-xs font-semibold text-white shadow-md hover:brightness-110 disabled:opacity-60"
                        >
                          {saving ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={() => {
                            setEditMode(false)
                            setName(profile?.name || '')
                          }}
                          className="rounded-xl border border-slate-600/80 bg-slate-900/70 px-4 py-1.5 text-xs font-medium text-slate-200 hover:border-slate-400/80"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-xl sm:text-2xl font-semibold text-slate-50">
                        {profile?.name}
                      </h2>
                      <button
                        onClick={() => setEditMode(true)}
                        className="text-xs font-medium text-violet-200 hover:text-violet-100"
                      >
                        Edit name
                      </button>
                    </>
                  )}

                  <div className="mt-3 space-y-1 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <Mail size={14} />
                      <span>{profile?.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      <span>
                        Joined{' '}
                        {profile?.created_at
                          ? formatDate(profile.created_at)
                          : 'Recently'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* stats */}
              <div className="grid w-full max-w-xs grid-cols-3 gap-3 sm:gap-4 text-center">
                <div className="rounded-2xl border border-violet-400/60 bg-violet-500/10 px-3 py-3">
                  <Gift className="mx-auto mb-1 h-5 w-5 text-violet-200" />
                  <p className="text-lg font-semibold text-slate-50">
                    {stats.created}
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-violet-100/80">
                    Created
                  </p>
                </div>
                <div className="rounded-2xl border border-emerald-400/60 bg-emerald-500/10 px-3 py-3">
                  <Award className="mx-auto mb-1 h-5 w-5 text-emerald-200" />
                  <p className="text-lg font-semibold text-slate-50">
                    {stats.active}
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-100/80">
                    Active
                  </p>
                </div>
                <div className="rounded-2xl border border-sky-400/60 bg-sky-500/10 px-3 py-3">
                  <Award className="mx-auto mb-1 h-5 w-5 text-sky-200" />
                  <p className="text-lg font-semibold text-slate-50">
                    {stats.claimed}
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-sky-100/80">
                    Claimed
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* recent offers card */}
          <section className="relative rounded-3xl border border-white/10 bg-slate-900/80 px-6 py-7 sm:px-10 sm:py-9 shadow-[0_24px_60px_rgba(15,23,42,0.95)] backdrop-blur-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-50">
                  Your Recent Offers
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  Last {userOffers.length || 0} offers you created.
                </p>
              </div>
              <Link
                href="/dashboard/create-offer"
                className="rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 px-4 py-2 text-xs font-semibold text-white shadow-md hover:brightness-110"
              >
                Create New +
              </Link>
            </div>

            {userOffers.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-slate-900/80 px-6 py-10 text-center">
                <p className="mb-4 text-sm text-slate-300">
                  You haven&apos;t created any offers yet.
                </p>
                <Link
                  href="/dashboard/create-offer"
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-md hover:brightness-110"
                >
                  Create Your First Offer
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {userOffers.map(offer => (
                  <div
                    key={offer.id}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-4 text-sm text-slate-200 hover:border-violet-500/70 hover:bg-slate-800/90 transition"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-semibold text-slate-50">
                          {offer.title}
                        </h4>
                        <span className={getStatusBadge(offer.status)}>
                          {offer.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                        <span className="inline-flex items-center gap-1">
                          <User size={12} />
                          {offer.category}
                        </span>
                        <span className="opacity-60">•</span>
                        <span>
                          Expires: {formatDate(offer.expiry_date)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteOffer(offer.id)}
                      disabled={deletingOfferId === offer.id}
                      className="ml-4 flex-shrink-0 rounded-xl border border-rose-400/70 bg-rose-500/10 p-2 text-rose-200 hover:bg-rose-500/20 transition disabled:opacity-50"
                      title="Delete offer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
