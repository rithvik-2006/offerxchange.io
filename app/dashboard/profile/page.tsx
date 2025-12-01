'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, User, Mail, Calendar, Gift, Award, Trash2, AlertCircle, CheckCircle, Moon, Sun } from 'lucide-react'
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
      // Profile doesn't exist, create it
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
    // Created offers
    const { count: created } = await supabase
      .from('offers')
      .select('*', { count: 'exact', head: true })
      .eq('owner_id', user.id)

    // Active offers
    const { count: active } = await supabase
      .from('offers')
      .select('*', { count: 'exact', head: true })
      .eq('owner_id', user.id)
      .eq('status', 'available')

    // Claimed offers (by user)
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

      setProfile(prev => prev ? { ...prev, name: name.trim() } : null)
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
      // First delete associated claims
      await supabase.from('claims').delete().eq('offer_id', offerId)
      
      // Then delete the offer
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
    const badges = {
      available: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      claimed: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      expired: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
      reserved: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
    }
    return badges[status as keyof typeof badges] || badges.expired
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-sm p-4">
        <div className="container mx-auto flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Profile</h1>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Message Alert */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success' 
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300'
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
          }`}>
            {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <p className="font-semibold">{message.text}</p>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {profile?.name ? profile.name[0].toUpperCase() : profile?.email[0].toUpperCase()}
              </div>
              <div>
                {editMode ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                      placeholder="Your name"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-semibold"
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={() => {
                          setEditMode(false)
                          setName(profile?.name || '')
                        }}
                        className="px-4 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold">{profile?.name}</h2>
                    <button
                      onClick={() => setEditMode(true)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Edit name
                    </button>
                  </>
                )}
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mt-2">
                  <Mail size={16} />
                  <span>{profile?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mt-1">
                  <Calendar size={16} />
                  <span>Joined {profile?.created_at ? formatDate(profile.created_at) : 'Recently'}</span>
                </div>
              </div>
            </div>

            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                title="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Gift className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold">{stats.created}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Created</p>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Award className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold">{stats.active}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Award className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
              <p className="text-2xl font-bold">{stats.claimed}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Claimed</p>
            </div>
          </div>
        </div>

        {/* Recent Offers */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Your Recent Offers</h3>
            <Link href="/dashboard/create-offer" className="text-blue-600 hover:underline text-sm font-semibold">
              Create New +
            </Link>
          </div>

          {userOffers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 mb-4">You haven't created any offers yet</p>
              <Link
                href="/dashboard/create-offer"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Create Your First Offer
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {userOffers.map(offer => (
                <div
                  key={offer.id}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-semibold">{offer.title}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusBadge(offer.status)}`}>
                        {offer.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>{offer.category}</span>
                      <span>•</span>
                      <span>Expires: {formatDate(offer.expiry_date)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteOffer(offer.id)}
                    disabled={deletingOfferId === offer.id}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition disabled:opacity-50"
                    title="Delete offer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
