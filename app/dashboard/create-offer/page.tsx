'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Gift, AlertCircle, CheckCircle } from 'lucide-react'

const CATEGORIES = [
  'Food',
  'Travel',
  'Shopping',
  'Bill Payments',
  'Entertainment',
  'Electronics',
  'Health & Wellness',
  'Education',
  'Other'
]

export default function CreateOffer() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    coupon_code: '',
    category: '',
    expiry_date: ''
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    router.push('/login')
    return
  }
  
  setUser(user)
  
  // Check if profile exists
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profileError && profileError.code === 'PGRST116') {
    // Profile doesn't exist, create it
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        avatar: user.user_metadata?.avatar_url || null
      })
    
    if (insertError) {
      console.error('Error creating profile:', insertError)
      setMessage({ 
        type: 'error', 
        text: 'Failed to initialize profile. Please refresh the page.' 
      })
    }
  }
}


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters'
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category'
    }

    if (!formData.expiry_date) {
      newErrors.expiry_date = 'Expiry date is required'
    } else {
      const expiryDate = new Date(formData.expiry_date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (expiryDate < today) {
        newErrors.expiry_date = 'Expiry date must be in the future'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      setMessage({ type: 'error', text: 'Please fix the errors before submitting' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const { data, error } = await supabase
        .from('offers')
        .insert({
          owner_id: user.id,
          title: formData.title.trim(),
          description: formData.description.trim(),
          coupon_code: formData.coupon_code.trim() || null,
          category: formData.category,
          expiry_date: new Date(formData.expiry_date).toISOString(),
          status: 'available'
        })
        .select()

      if (error) throw error

      setMessage({ type: 'success', text: 'Offer created successfully! Redirecting...' })
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        coupon_code: '',
        category: '',
        expiry_date: ''
      })

      setTimeout(() => {
        router.push('/dashboard/browse-offers')
      }, 2000)

    } catch (error: any) {
      console.error('Error creating offer:', error)
      setMessage({ type: 'error', text: error.message || 'Failed to create offer. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-sm p-4">
        <div className="container mx-auto flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Create Offer</h1>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Gift className="text-blue-600 dark:text-blue-400" size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Share an Offer</h2>
              <p className="text-gray-600 dark:text-gray-400">Help others save by sharing your unused coupons</p>
            </div>
          </div>

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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold mb-2">
                Offer Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., 50% Off Pizza Delivery"
                className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none ${
                  errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                maxLength={100}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.title}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">{formData.title.length}/100 characters</p>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the offer, any terms and conditions, or usage instructions..."
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none resize-none ${
                  errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                maxLength={500}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.description}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">{formData.description.length}/500 characters</p>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-semibold mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none ${
                  errors.category ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <option value="">Select a category</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.category}
                </p>
              )}
            </div>

            {/* Coupon Code */}
            <div>
              <label htmlFor="coupon_code" className="block text-sm font-semibold mb-2">
                Coupon Code (Optional)
              </label>
              <input
                type="text"
                id="coupon_code"
                name="coupon_code"
                value={formData.coupon_code}
                onChange={handleChange}
                placeholder="e.g., SAVE50"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                maxLength={50}
              />
              <p className="mt-1 text-xs text-gray-500">
                This will only be visible to the person who claims the offer
              </p>
            </div>

            {/* Expiry Date */}
            <div>
              <label htmlFor="expiry_date" className="block text-sm font-semibold mb-2">
                Expiry Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="expiry_date"
                name="expiry_date"
                value={formData.expiry_date}
                onChange={handleChange}
                min={getMinDate()}
                className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none ${
                  errors.expiry_date ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.expiry_date && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.expiry_date}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition duration-200"
              >
                {loading ? 'Creating...' : 'Create Offer'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
