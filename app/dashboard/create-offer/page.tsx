

// 'use client'
// import { useEffect, useState } from 'react'
// import { supabase } from '@/lib/supabase'
// import { useRouter } from 'next/navigation'
// import Link from 'next/link'
// import { ArrowLeft, Gift, AlertCircle, CheckCircle } from 'lucide-react'

// const CATEGORIES = [
//   'Food',
//   'Travel',
//   'Shopping',
//   'Bill Payments',
//   'Entertainment',
//   'Electronics',
//   'Health & Wellness',
//   'Education',
//   'Other'
// ]

// export default function CreateOffer() {
//   const [user, setUser] = useState<any>(null)
//   const [loading, setLoading] = useState(false)
//   const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
//   const router = useRouter()

//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     coupon_code: '',
//     category: '',
//     expiry_date: ''
//   })

//   const [errors, setErrors] = useState<{ [key: string]: string }>({})

//   useEffect(() => {
//     checkUser()
//   }, [])

//   const checkUser = async () => {
//     const { data: { user } } = await supabase.auth.getUser()
//     if (!user) {
//       router.push('/login')
//       return
//     }

//     setUser(user)

//     // Check if profile exists
//     const { data: profile, error: profileError } = await supabase
//       .from('profiles')
//       .select('*')
//       .eq('id', user.id)
//       .single()

//     if (profileError && profileError.code === 'PGRST116') {
//       // Profile doesn't exist, create it
//       const { error: insertError } = await supabase
//         .from('profiles')
//         .insert({
//           id: user.id,
//           email: user.email,
//           name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
//           avatar: user.user_metadata?.avatar_url || null
//         })

//       if (insertError) {
//         console.error('Error creating profile:', insertError)
//         setMessage({
//           type: 'error',
//           text: 'Failed to initialize profile. Please refresh the page.'
//         })
//       }
//     }
//   }

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target
//     setFormData(prev => ({ ...prev, [name]: value }))
//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }))
//     }
//   }

//   const validateForm = () => {
//     const newErrors: { [key: string]: string } = {}

//     if (!formData.title.trim()) {
//       newErrors.title = 'Title is required'
//     } else if (formData.title.length < 5) {
//       newErrors.title = 'Title must be at least 5 characters'
//     }

//     if (!formData.description.trim()) {
//       newErrors.description = 'Description is required'
//     } else if (formData.description.length < 10) {
//       newErrors.description = 'Description must be at least 10 characters'
//     }

//     if (!formData.category) {
//       newErrors.category = 'Please select a category'
//     }

//     if (!formData.expiry_date) {
//       newErrors.expiry_date = 'Expiry date is required'
//     } else {
//       const expiryDate = new Date(formData.expiry_date)
//       const today = new Date()
//       today.setHours(0, 0, 0, 0)

//       if (expiryDate < today) {
//         newErrors.expiry_date = 'Expiry date must be in the future'
//       }
//     }

//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!validateForm()) {
//       setMessage({ type: 'error', text: 'Please fix the errors before submitting' })
//       return
//     }

//     setLoading(true)
//     setMessage(null)

//     try {
//       const { data, error } = await supabase
//         .from('offers')
//         .insert({
//           owner_id: user.id,
//           title: formData.title.trim(),
//           description: formData.description.trim(),
//           coupon_code: formData.coupon_code.trim() || null,
//           category: formData.category,
//           expiry_date: new Date(formData.expiry_date).toISOString(),
//           status: 'available'
//         })
//         .select()

//       if (error) throw error

//       setMessage({ type: 'success', text: 'Offer created successfully! Redirecting...' })

//       // Reset form
//       setFormData({
//         title: '',
//         description: '',
//         coupon_code: '',
//         category: '',
//         expiry_date: ''
//       })

//       setTimeout(() => {
//         router.push('/dashboard/browse-offers')
//       }, 2000)

//     } catch (error: any) {
//       console.error('Error creating offer:', error)
//       setMessage({ type: 'error', text: error.message || 'Failed to create offer. Please try again.' })
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Get minimum date (today)
//   const getMinDate = () => {
//     const today = new Date()
//     return today.toISOString().split('T')[0]
//   }

//   return (
//     <div className="relative min-h-screen bg-slate-950 text-slate-50 flex flex-col">
//       {/* Background glows */}
//       <div
//         className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.22),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(56,189,248,0.18),_transparent_55%)]"
//         aria-hidden="true"
//       />

//       {/* Top Nav */}
//       <nav className="border-b border-white/5 bg-slate-950/70 backdrop-blur-xl">
//         <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <Link
//               href="/dashboard"
//               className="inline-flex items-center justify-center rounded-full border border-white/10 bg-slate-900/70 p-2 hover:bg-slate-800 hover:border-violet-500/60 transition"
//             >
//               <ArrowLeft size={18} />
//             </Link>
//             <div className="flex flex-col">
//               <span className="text-xs uppercase tracking-[0.18em] text-slate-400">Create</span>
//               <h1 className="text-lg font-semibold text-slate-50">New Offer</h1>
//             </div>
//           </div>

//           <div className="hidden sm:flex items-center gap-6 text-sm text-slate-300">
//             <span className="font-medium tracking-wide text-slate-200">Xchange</span>
//             <button
//               type="button"
//               onClick={() => router.push('/logout')}
//               className="rounded-full border border-white/10 bg-slate-900/70 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-slate-300 hover:border-rose-500/70 hover:text-rose-200 transition"
//             >
//               Logout
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* Main */}
//       <main className="flex-1 flex items-center justify-center px-4 py-10">
//         <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900/70 border border-white/5 shadow-[0_0_80px_rgba(109,40,217,0.55)] backdrop-blur-2xl px-6 py-8 sm:px-10 sm:py-10">
//           {/* Top highlight line */}
//           <div className="pointer-events-none absolute inset-x-10 -top-px h-px bg-gradient-to-r from-transparent via-violet-500/70 to-transparent" />

//           {/* Card header */}
//           <div className="flex items-center gap-4 mb-8">
//             <div className="relative">
//               <div className="absolute inset-0 blur-xl bg-violet-500/35" />
//               <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-indigo-500 shadow-lg shadow-violet-500/50">
//                 <Gift className="h-7 w-7 text-white" />
//               </div>
//             </div>
//             <div>
//               <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-50">
//                 Share an Offer
//               </h2>
//               <p className="mt-1 text-sm text-slate-400">
//                 Help others save by sharing your unused coupons
//               </p>
//             </div>
//           </div>

//           {/* Message Alert */}
//           {message && (
//             <div
//               className={`mb-6 flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm shadow-md ${
//                 message.type === 'success'
//                   ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-100'
//                   : 'border-rose-500/50 bg-rose-500/10 text-rose-100'
//               }`}
//             >
//               {message.type === 'success' ? (
//                 <CheckCircle size={18} className="shrink-0" />
//               ) : (
//                 <AlertCircle size={18} className="shrink-0" />
//               )}
//               <p className="font-medium">{message.text}</p>
//             </div>
//           )}

//           {/* Form */}
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Title */}
//             <div className="space-y-2">
//               <div className="flex items-center justify-between gap-3">
//                 <label htmlFor="title" className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
//                   Offer Title <span className="text-rose-400">*</span>
//                 </label>
//                 <span className="text-[11px] text-slate-500">
//                   {formData.title.length}/100 characters
//                 </span>
//               </div>
//               <input
//                 type="text"
//                 id="title"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleChange}
//                 placeholder="e.g., 50% Off Pizza Delivery"
//                 maxLength={100}
//                 className={`w-full rounded-2xl border bg-slate-900/70 px-4 py-3.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition 
//                 shadow-[0_0_0_1px_rgba(15,23,42,0.8)]
//                 focus:shadow-[0_0_0_1px_rgba(139,92,246,0.6)] focus:ring-2 focus:ring-violet-500/60 focus:ring-offset-0
//                 ${
//                   errors.title
//                     ? 'border-rose-500/70'
//                     : 'border-slate-700/80 hover:border-slate-500/80'
//                 }`}
//               />
//               {errors.title && (
//                 <p className="mt-1 flex items-center gap-1 text-xs text-rose-400">
//                   <AlertCircle size={14} />
//                   {errors.title}
//                 </p>
//               )}
//             </div>

//             {/* Description */}
//             <div className="space-y-2">
//               <div className="flex items-center justify-between gap-3">
//                 <label
//                   htmlFor="description"
//                   className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400"
//                 >
//                   Description <span className="text-rose-400">*</span>
//                 </label>
//                 <span className="text-[11px] text-slate-500">
//                   {formData.description.length}/500 characters
//                 </span>
//               </div>
//               <textarea
//                 id="description"
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 placeholder="Describe the offer, any terms and conditions, or usage instructions..."
//                 rows={4}
//                 maxLength={500}
//                 className={`w-full resize-none rounded-2xl border bg-slate-900/70 px-4 py-3.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition
//                 shadow-[0_0_0_1px_rgba(15,23,42,0.8)]
//                 focus:shadow-[0_0_0_1px_rgba(139,92,246,0.6)] focus:ring-2 focus:ring-violet-500/60 
//                 ${
//                   errors.description
//                     ? 'border-rose-500/70'
//                     : 'border-slate-700/80 hover:border-slate-500/80'
//                 }`}
//               />
//               {errors.description && (
//                 <p className="mt-1 flex items-center gap-1 text-xs text-rose-400">
//                   <AlertCircle size={14} />
//                   {errors.description}
//                 </p>
//               )}
//             </div>

//             {/* Category */}
//             <div className="space-y-2">
//               <label
//                 htmlFor="category"
//                 className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400"
//               >
//                 Category <span className="text-rose-400">*</span>
//               </label>
//               <div className="relative">
//                 <select
//                   id="category"
//                   name="category"
//                   value={formData.category}
//                   onChange={handleChange}
//                   className={`w-full appearance-none rounded-2xl border bg-slate-900/70 px-4 py-3.5 text-sm text-slate-100 outline-none transition
//                   shadow-[0_0_0_1px_rgba(15,23,42,0.8)]
//                   focus:shadow-[0_0_0_1px_rgba(139,92,246,0.6)] focus:ring-2 focus:ring-violet-500/60
//                   ${
//                     errors.category
//                       ? 'border-rose-500/70'
//                       : 'border-slate-700/80 hover:border-slate-500/80'
//                   }`}
//                 >
//                   <option value="" className="bg-slate-900">
//                     Select a category
//                   </option>
//                   {CATEGORIES.map(cat => (
//                     <option key={cat} value={cat} className="bg-slate-900">
//                       {cat}
//                     </option>
//                   ))}
//                 </select>
//                 <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-500">
//                   ▾
//                 </div>
//               </div>
//               {errors.category && (
//                 <p className="mt-1 flex items-center gap-1 text-xs text-rose-400">
//                   <AlertCircle size={14} />
//                   {errors.category}
//                 </p>
//               )}
//             </div>

//             {/* Coupon Code */}
//             <div className="space-y-2">
//               <label
//                 htmlFor="coupon_code"
//                 className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400"
//               >
//                 Coupon Code (Optional)
//               </label>
//               <input
//                 type="text"
//                 id="coupon_code"
//                 name="coupon_code"
//                 value={formData.coupon_code}
//                 onChange={handleChange}
//                 placeholder="e.g., SAVE50"
//                 maxLength={50}
//                 className="w-full rounded-2xl border border-slate-700/80 bg-slate-900/70 px-4 py-3.5 text-sm font-mono text-slate-100 placeholder:text-slate-500 outline-none transition shadow-[0_0_0_1px_rgba(15,23,42,0.8)] focus:border-violet-500/70 focus:shadow-[0_0_0_1px_rgba(139,92,246,0.7)] focus:ring-2 focus:ring-violet-500/60"
//               />
//               <p className="text-[11px] text-slate-500">
//                 This will only be visible to the person who claims the offer.
//               </p>
//             </div>

//             {/* Expiry Date */}
//             <div className="space-y-2">
//               <label
//                 htmlFor="expiry_date"
//                 className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400"
//               >
//                 Expiry Date <span className="text-rose-400">*</span>
//               </label>
//               <input
//                 type="date"
//                 id="expiry_date"
//                 name="expiry_date"
//                 value={formData.expiry_date}
//                 onChange={handleChange}
//                 min={getMinDate()}
//                 className={`w-full rounded-2xl border bg-slate-900/70 px-4 py-3.5 text-sm text-slate-100 outline-none transition
//                 shadow-[0_0_0_1px_rgba(15,23,42,0.8)]
//                 focus:shadow-[0_0_0_1px_rgba(139,92,246,0.6)] focus:ring-2 focus:ring-violet-500/60
//                 ${
//                   errors.expiry_date
//                     ? 'border-rose-500/70'
//                     : 'border-slate-700/80 hover:border-slate-500/80'
//                 }`}
//               />
//               {errors.expiry_date && (
//                 <p className="mt-1 flex items-center gap-1 text-xs text-rose-400">
//                   <AlertCircle size={14} />
//                   {errors.expiry_date}
//                 </p>
//               )}
//             </div>

//             {/* Buttons */}
//             <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
//               <button
//                 type="button"
//                 onClick={() => router.push('/dashboard')}
//                 className="w-full sm:w-auto rounded-2xl border border-slate-700/80 bg-slate-900/70 px-5 py-3 text-sm font-medium text-slate-200 shadow-sm hover:border-slate-400/80 hover:bg-slate-800 transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full sm:w-auto rounded-2xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(109,40,217,0.75)] transition hover:brightness-110 hover:shadow-[0_22px_55px_rgba(109,40,217,0.85)] disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
//               >
//                 {loading ? 'Creating...' : 'Create Offer'}
//               </button>
//             </div>
//           </form>
//         </div>
//       </main>
//     </div>
//   )
// }
// 'use client'
// import { useEffect, useState } from 'react'
// import { supabase } from '@/lib/supabase'
// import { useRouter } from 'next/navigation'
// import Link from 'next/link'
// import { ArrowLeft, Gift, AlertCircle, CheckCircle, LogOut } from 'lucide-react'

// const CATEGORIES = [
//   'Food',
//   'Travel',
//   'Shopping',
//   'Bill Payments',
//   'Entertainment',
//   'Electronics',
//   'Health & Wellness',
//   'Education',
//   'Other'
// ]

// export default function CreateOffer() {
//   const [user, setUser] = useState<any>(null)
//   const [loading, setLoading] = useState(false)
//   const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
//   const router = useRouter()

//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     coupon_code: '',
//     category: '',
//     expiry_date: ''
//   })

//   const [errors, setErrors] = useState<{ [key: string]: string }>({})

//   useEffect(() => {
//     checkUser()
//   }, [])

//   const checkUser = async () => {
//     const { data: { user } } = await supabase.auth.getUser()
//     if (!user) {
//       router.push('/login')
//       return
//     }

//     setUser(user)

//     // Check if profile exists
//     const { data: profile, error: profileError } = await supabase
//       .from('profiles')
//       .select('*')
//       .eq('id', user.id)
//       .single()

//     if (profileError && profileError.code === 'PGRST116') {
//       const { error: insertError } = await supabase
//         .from('profiles')
//         .insert({
//           id: user.id,
//           email: user.email,
//           name:
//             user.user_metadata?.name ||
//             user.user_metadata?.full_name ||
//             user.email?.split('@')[0] ||
//             'User',
//           avatar: user.user_metadata?.avatar_url || null
//         })

//       if (insertError) {
//         console.error('Error creating profile:', insertError)
//         setMessage({
//           type: 'error',
//           text: 'Failed to initialize profile. Please refresh the page.'
//         })
//       }
//     }
//   }

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target
//     setFormData(prev => ({ ...prev, [name]: value }))
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }))
//     }
//   }

//   const validateForm = () => {
//     const newErrors: { [key: string]: string } = {}

//     if (!formData.title.trim()) {
//       newErrors.title = 'Title is required'
//     } else if (formData.title.length < 5) {
//       newErrors.title = 'Title must be at least 5 characters'
//     }

//     if (!formData.description.trim()) {
//       newErrors.description = 'Description is required'
//     } else if (formData.description.length < 10) {
//       newErrors.description = 'Description must be at least 10 characters'
//     }

//     if (!formData.category) {
//       newErrors.category = 'Please select a category'
//     }

//     if (!formData.expiry_date) {
//       newErrors.expiry_date = 'Expiry date is required'
//     } else {
//       const expiryDate = new Date(formData.expiry_date)
//       const today = new Date()
//       today.setHours(0, 0, 0, 0)

//       if (expiryDate < today) {
//         newErrors.expiry_date = 'Expiry date must be in the future'
//       }
//     }

//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!validateForm()) {
//       setMessage({ type: 'error', text: 'Please fix the errors before submitting' })
//       return
//     }

//     setLoading(true)
//     setMessage(null)

//     try {
//       const { error } = await supabase
//         .from('offers')
//         .insert({
//           owner_id: user.id,
//           title: formData.title.trim(),
//           description: formData.description.trim(),
//           coupon_code: formData.coupon_code.trim() || null,
//           category: formData.category,
//           expiry_date: new Date(formData.expiry_date).toISOString(),
//           status: 'available'
//         })
//         .select()

//       if (error) throw error

//       setMessage({ type: 'success', text: 'Offer created successfully! Redirecting...' })

//       setFormData({
//         title: '',
//         description: '',
//         coupon_code: '',
//         category: '',
//         expiry_date: ''
//       })

//       setTimeout(() => {
//         router.push('/dashboard/browse-offers')
//       }, 2000)
//     } catch (error: any) {
//       console.error('Error creating offer:', error)
//       setMessage({
//         type: 'error',
//         text: error.message || 'Failed to create offer. Please try again.'
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const getMinDate = () => {
//     const today = new Date()
//     return today.toISOString().split('T')[0]
//   }

//   return (
//     <div className="relative min-h-screen bg-slate-950 text-slate-50 flex flex-col">
//       {/* Background like the screenshot – strong purple on left, teal on bottom-right */}
//       <div
//         className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_left,_rgba(139,92,246,0.45),_transparent_55%),radial-gradient(circle_at_bottom_right,_rgba(45,212,191,0.26),_transparent_55%)]"
//         aria-hidden="true"
//       />

//       {/* Top bar – back + title on left, brand + logout on right */}
//       <nav className="px-8 pt-6 pb-4 flex items-center justify-between text-sm">
//         <div className="flex items-center gap-2 text-slate-300">
//           <Link
//             href="/dashboard"
//             className="inline-flex items-center gap-2 hover:text-slate-50 transition"
//           >
//             <ArrowLeft size={18} />
//             <span className="text-xs font-medium">Create Offer</span>
//           </Link>
//         </div>

//         <div className="flex items-center gap-6">
//           <span className="text-xs tracking-[0.22em] uppercase text-slate-300">
//             Xchange
//           </span>
//           <button
//             type="button"
//             onClick={async () => {
//               await supabase.auth.signOut()
//               router.push('/')
//             }}
//             className="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.2em] text-slate-300 hover:text-slate-50 transition"
//           >
//             <LogOut size={14} />
//             Logout
//           </button>
//         </div>
//       </nav>

//       {/* Center card */}
//       <main className="flex-1 flex items-center justify-center px-4 pb-12">
//         <div className="relative w-full max-w-3xl rounded-3xl bg-slate-900/80 border border-white/5 shadow-[0_0_80px_rgba(109,40,217,0.65)] backdrop-blur-2xl px-8 py-10">
//           {/* thin highlight line on top */}
//           <div className="pointer-events-none absolute inset-x-12 -top-px h-px bg-gradient-to-r from-transparent via-violet-500/70 to-transparent" />

//           {/* header with icon */}
//           <div className="flex flex-col items-center mb-8">
//             <div className="relative mb-4">
//               <div className="absolute inset-0 blur-xl bg-violet-500/40" />
//               <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-indigo-500 shadow-lg shadow-violet-500/60">
//                 <Gift className="h-8 w-8 text-white" />
//               </div>
//             </div>
//             <h2 className="text-2xl sm:text-3xl font-semibold text-slate-50">
//               Share an Offer
//             </h2>
//             <p className="mt-2 text-sm text-slate-400">
//               Help others save by sharing your unused coupons
//             </p>
//           </div>

//           {/* message banner */}
//           {message && (
//             <div
//               className={`mb-6 flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm shadow-md ${
//                 message.type === 'success'
//                   ? 'border-emerald-500/60 bg-emerald-500/12 text-emerald-100'
//                   : 'border-rose-500/60 bg-rose-500/12 text-rose-100'
//               }`}
//             >
//               {message.type === 'success' ? (
//                 <CheckCircle size={18} className="shrink-0" />
//               ) : (
//                 <AlertCircle size={18} className="shrink-0" />
//               )}
//             <p className="font-medium">{message.text}</p>
//             </div>
//           )}

//           {/* form */}
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* title */}
//             <div className="space-y-2">
//               <div className="flex items-center justify-between gap-3">
//                 <label
//                   htmlFor="title"
//                   className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400"
//                 >
//                   Offer Title <span className="text-rose-400">*</span>
//                 </label>
//                 <span className="text-[11px] text-slate-500">
//                   {formData.title.length}/100 characters
//                 </span>
//               </div>
//               <input
//                 type="text"
//                 id="title"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleChange}
//                 placeholder="e.g., 50% Off Pizza Delivery"
//                 maxLength={100}
//                 className={`w-full rounded-xl border bg-[#050816]/70 px-4 py-3.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition
//                   shadow-[0_0_0_1px_rgba(15,23,42,0.9)]
//                   focus:shadow-[0_0_0_1px_rgba(139,92,246,0.7)] focus:ring-2 focus:ring-violet-500/70
//                   ${
//                     errors.title
//                       ? 'border-rose-500/80'
//                       : 'border-slate-700/80 hover:border-slate-500/80'
//                   }`}
//               />
//               {errors.title && (
//                 <p className="mt-1 flex items-center gap-1 text-xs text-rose-300">
//                   <AlertCircle size={14} />
//                   {errors.title}
//                 </p>
//               )}
//             </div>

//             {/* description */}
//             <div className="space-y-2">
//               <div className="flex items-center justify-between gap-3">
//                 <label
//                   htmlFor="description"
//                   className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400"
//                 >
//                   Description <span className="text-rose-400">*</span>
//                 </label>
//                 <span className="text-[11px] text-slate-500">
//                   {formData.description.length}/500 characters
//                 </span>
//               </div>
//               <textarea
//                 id="description"
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 placeholder="Describe the offer, any terms and conditions, or usage instructions..."
//                 rows={4}
//                 maxLength={500}
//                 className={`w-full resize-none rounded-xl border bg-[#050816]/70 px-4 py-3.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition
//                   shadow-[0_0_0_1px_rgba(15,23,42,0.9)]
//                   focus:shadow-[0_0_0_1px_rgba(139,92,246,0.7)] focus:ring-2 focus:ring-violet-500/70
//                   ${
//                     errors.description
//                       ? 'border-rose-500/80'
//                       : 'border-slate-700/80 hover:border-slate-500/80'
//                   }`}
//               />
//               {errors.description && (
//                 <p className="mt-1 flex items-center gap-1 text-xs text-rose-300">
//                   <AlertCircle size={14} />
//                   {errors.description}
//                 </p>
//               )}
//             </div>

//             {/* category */}
//             <div className="space-y-2">
//               <label
//                 htmlFor="category"
//                 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400"
//               >
//                 Category <span className="text-rose-400">*</span>
//               </label>
//               <div className="relative">
//                 <select
//                   id="category"
//                   name="category"
//                   value={formData.category}
//                   onChange={handleChange}
//                   className={`w-full appearance-none rounded-xl border bg-[#050816]/70 px-4 py-3.5 text-sm text-slate-100 outline-none transition
//                     shadow-[0_0_0_1px_rgba(15,23,42,0.9)]
//                     focus:shadow-[0_0_0_1px_rgba(139,92,246,0.7)] focus:ring-2 focus:ring-violet-500/70
//                     ${
//                       errors.category
//                         ? 'border-rose-500/80'
//                         : 'border-slate-700/80 hover:border-slate-500/80'
//                     }`}
//                 >
//                   <option value="" className="bg-slate-900">
//                     Select a category
//                   </option>
//                   {CATEGORIES.map(cat => (
//                     <option key={cat} value={cat} className="bg-slate-900">
//                       {cat}
//                     </option>
//                   ))}
//                 </select>
//                 <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-500 text-xs">
//                   ▾
//                 </div>
//               </div>
//               {errors.category && (
//                 <p className="mt-1 flex items-center gap-1 text-xs text-rose-300">
//                   <AlertCircle size={14} />
//                   {errors.category}
//                 </p>
//               )}
//             </div>

//             {/* coupon */}
//             <div className="space-y-2">
//               <label
//                 htmlFor="coupon_code"
//                 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400"
//               >
//                 Coupon Code (Optional)
//               </label>
//               <input
//                 type="text"
//                 id="coupon_code"
//                 name="coupon_code"
//                 value={formData.coupon_code}
//                 onChange={handleChange}
//                 placeholder="e.g., SAVE50"
//                 maxLength={50}
//                 className="w-full rounded-xl border border-slate-700/80 bg-[#050816]/70 px-4 py-3.5 text-sm font-mono text-slate-100 placeholder:text-slate-500 outline-none transition shadow-[0_0_0_1px_rgba(15,23,42,0.9)] focus:border-violet-500/70 focus:shadow-[0_0_0_1px_rgba(139,92,246,0.75)] focus:ring-2 focus:ring-violet-500/70"
//               />
//               <p className="text-[11px] text-slate-500">
//                 This will only be visible to the person who claims the offer.
//               </p>
//             </div>

//             {/* expiry */}
//             <div className="space-y-2">
//               <label
//                 htmlFor="expiry_date"
//                 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400"
//               >
//                 Expiry Date <span className="text-rose-400">*</span>
//               </label>
//               <input
//                 type="date"
//                 id="expiry_date"
//                 name="expiry_date"
//                 value={formData.expiry_date}
//                 onChange={handleChange}
//                 min={getMinDate()}
//                 className={`w-full rounded-xl border bg-[#050816]/70 px-4 py-3.5 text-sm text-slate-100 outline-none transition
//                   shadow-[0_0_0_1px_rgba(15,23,42,0.9)]
//                   focus:shadow-[0_0_0_1px_rgba(139,92,246,0.7)] focus:ring-2 focus:ring-violet-500/70
//                   ${
//                     errors.expiry_date
//                       ? 'border-rose-500/80'
//                       : 'border-slate-700/80 hover:border-slate-500/80'
//                   }`}
//               />
//               {errors.expiry_date && (
//                 <p className="mt-1 flex items-center gap-1 text-xs text-rose-300">
//                   <AlertCircle size={14} />
//                   {errors.expiry_date}
//                 </p>
//               )}
//             </div>

//             {/* buttons */}
//             <div className="mt-6 flex justify-end gap-3">
//               <button
//                 type="button"
//                 onClick={() => router.push('/dashboard')}
//                 className="rounded-xl border border-slate-700/80 bg-[#050816]/80 px-6 py-3 text-sm font-semibold text-slate-200 shadow-sm hover:border-slate-400/80 hover:bg-slate-800 transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="rounded-xl bg-gradient-to-r from-[#a855f7] via-[#ec4899] to-[#6366f1] px-8 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(109,40,217,0.8)] transition hover:brightness-110 hover:shadow-[0_22px_55px_rgba(109,40,217,0.95)] disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
//               >
//                 {loading ? 'Creating...' : 'Create Offer'}
//               </button>
//             </div>
//           </form>
//         </div>
//       </main>
//     </div>
//   )
// }
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
    <div className="relative min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      {/* Background glows */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.22),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(56,189,248,0.18),_transparent_55%)]"
        aria-hidden="true"
      />

      {/* Top Nav */}
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
              <span className="text-xs uppercase tracking-[0.18em] text-slate-400">Create</span>
              <h1 className="text-lg font-semibold text-slate-50">New Offer</h1>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-6 text-sm text-slate-300">
            <span className="font-medium tracking-wide text-slate-200">Xchange</span>
            <button
              type="button"
              onClick={() => router.push('/logout')}
              className="rounded-full border border-white/10 bg-slate-900/70 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-slate-300 hover:border-rose-500/70 hover:text-rose-200 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900/70 border border-white/5 shadow-[0_0_80px_rgba(109,40,217,0.55)] backdrop-blur-2xl px-6 py-8 sm:px-10 sm:py-10">
          {/* Top highlight line */}
          <div className="pointer-events-none absolute inset-x-10 -top-px h-px bg-gradient-to-r from-transparent via-violet-500/70 to-transparent" />

          {/* Card header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="relative">
              <div className="absolute inset-0 blur-xl bg-violet-500/35" />
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-indigo-500 shadow-lg shadow-violet-500/50">
                <Gift className="h-7 w-7 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-50">
                Share an Offer
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Help others save by sharing your unused coupons
              </p>
            </div>
          </div>

          {/* Message Alert */}
          {message && (
            <div
              className={`mb-6 flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm shadow-md ${
                message.type === 'success'
                  ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-100'
                  : 'border-rose-500/50 bg-rose-500/10 text-rose-100'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle size={18} className="shrink-0" />
              ) : (
                <AlertCircle size={18} className="shrink-0" />
              )}
              <p className="font-medium">{message.text}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="title" className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                  Offer Title <span className="text-rose-400">*</span>
                </label>
                <span className="text-[11px] text-slate-500">
                  {formData.title.length}/100 characters
                </span>
              </div>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., 50% Off Pizza Delivery"
                maxLength={100}
                className={`w-full rounded-2xl border bg-slate-900/70 px-4 py-3.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition 
                shadow-[0_0_0_1px_rgba(15,23,42,0.8)]
                focus:shadow-[0_0_0_1px_rgba(139,92,246,0.6)] focus:ring-2 focus:ring-violet-500/60 focus:ring-offset-0
                ${
                  errors.title
                    ? 'border-rose-500/70'
                    : 'border-slate-700/80 hover:border-slate-500/80'
                }`}
              />
              {errors.title && (
                <p className="mt-1 flex items-center gap-1 text-xs text-rose-400">
                  <AlertCircle size={14} />
                  {errors.title}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor="description"
                  className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400"
                >
                  Description <span className="text-rose-400">*</span>
                </label>
                <span className="text-[11px] text-slate-500">
                  {formData.description.length}/500 characters
                </span>
              </div>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the offer, any terms and conditions, or usage instructions..."
                rows={4}
                maxLength={500}
                className={`w-full resize-none rounded-2xl border bg-slate-900/70 px-4 py-3.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition
                shadow-[0_0_0_1px_rgba(15,23,42,0.8)]
                focus:shadow-[0_0_0_1px_rgba(139,92,246,0.6)] focus:ring-2 focus:ring-violet-500/60 
                ${
                  errors.description
                    ? 'border-rose-500/70'
                    : 'border-slate-700/80 hover:border-slate-500/80'
                }`}
              />
              {errors.description && (
                <p className="mt-1 flex items-center gap-1 text-xs text-rose-400">
                  <AlertCircle size={14} />
                  {errors.description}
                </p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label
                htmlFor="category"
                className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400"
              >
                Category <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full appearance-none rounded-2xl border bg-slate-900/70 px-4 py-3.5 text-sm text-slate-100 outline-none transition
                  shadow-[0_0_0_1px_rgba(15,23,42,0.8)]
                  focus:shadow-[0_0_0_1px_rgba(139,92,246,0.6)] focus:ring-2 focus:ring-violet-500/60
                  ${
                    errors.category
                      ? 'border-rose-500/70'
                      : 'border-slate-700/80 hover:border-slate-500/80'
                  }`}
                >
                  <option value="" className="bg-slate-900">
                    Select a category
                  </option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat} className="bg-slate-900">
                      {cat}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-500">
                  ▾
                </div>
              </div>
              {errors.category && (
                <p className="mt-1 flex items-center gap-1 text-xs text-rose-400">
                  <AlertCircle size={14} />
                  {errors.category}
                </p>
              )}
            </div>

            {/* Coupon Code */}
            <div className="space-y-2">
              <label
                htmlFor="coupon_code"
                className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400"
              >
                Coupon Code (Optional)
              </label>
              <input
                type="text"
                id="coupon_code"
                name="coupon_code"
                value={formData.coupon_code}
                onChange={handleChange}
                placeholder="e.g., SAVE50"
                maxLength={50}
                className="w-full rounded-2xl border border-slate-700/80 bg-slate-900/70 px-4 py-3.5 text-sm font-mono text-slate-100 placeholder:text-slate-500 outline-none transition shadow-[0_0_0_1px_rgba(15,23,42,0.8)] focus:border-violet-500/70 focus:shadow-[0_0_0_1px_rgba(139,92,246,0.7)] focus:ring-2 focus:ring-violet-500/60"
              />
              <p className="text-[11px] text-slate-500">
                This will only be visible to the person who claims the offer.
              </p>
            </div>

            {/* Expiry Date */}
            <div className="space-y-2">
              <label
                htmlFor="expiry_date"
                className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400"
              >
                Expiry Date <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                id="expiry_date"
                name="expiry_date"
                value={formData.expiry_date}
                onChange={handleChange}
                min={getMinDate()}
                className={`w-full rounded-2xl border bg-slate-900/70 px-4 py-3.5 text-sm text-slate-100 outline-none transition
                shadow-[0_0_0_1px_rgba(15,23,42,0.8)]
                focus:shadow-[0_0_0_1px_rgba(139,92,246,0.6)] focus:ring-2 focus:ring-violet-500/60
                ${
                  errors.expiry_date
                    ? 'border-rose-500/70'
                    : 'border-slate-700/80 hover:border-slate-500/80'
                }`}
              />
              {errors.expiry_date && (
                <p className="mt-1 flex items-center gap-1 text-xs text-rose-400">
                  <AlertCircle size={14} />
                  {errors.expiry_date}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="w-full sm:w-auto rounded-2xl border border-slate-700/80 bg-slate-900/70 px-5 py-3 text-sm font-medium text-slate-200 shadow-sm hover:border-slate-400/80 hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto rounded-2xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(109,40,217,0.75)] transition hover:brightness-110 hover:shadow-[0_22px_55px_rgba(109,40,217,0.85)] disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
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
