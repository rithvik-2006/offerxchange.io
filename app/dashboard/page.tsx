// 'use client'
// import { useEffect, useState } from 'react'
// import { supabase } from '@/lib/supabase'
// import { useRouter } from 'next/navigation'
// import Link from 'next/link'
// import { PlusCircle, Search, Award, User, LogOut } from 'lucide-react'

// export default function Dashboard() {
//   const [user, setUser] = useState<any>(null)
//   const [offerCount, setOfferCount] = useState(0)
//   const router = useRouter()

//   useEffect(() => {
//     checkUser()
//     getOfferCount()
//   }, [])

//   const checkUser = async () => {
//     const { data: { user } } = await supabase.auth.getUser()
//     if (!user) router.push('/login')
//     else setUser(user)
//   }

//   const getOfferCount = async () => {
//     const { count } = await supabase
//       .from('offers')
//       .select('*', { count: 'exact', head: true })
//       .eq('status', 'available')
//     setOfferCount(count || 0)
//   }

//   const handleLogout = async () => {
//     await supabase.auth.signOut()
//     router.push('/')
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
//       <nav className="bg-white dark:bg-gray-800 shadow-sm p-4 flex justify-between items-center">
//         <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Xchange</h1>
//         <button onClick={handleLogout} className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-red-600">
//           <LogOut size={20} /> Logout
//         </button>
//       </nav>

//       <main className="container mx-auto px-4 py-12">
//         <h2 className="text-4xl font-bold mb-2">Welcome back!</h2>
//         <p className="text-gray-600 dark:text-gray-400 mb-12">{offerCount} offers available to claim</p>

//         <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
//           <Link href="/dashboard/create-offer" className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
//             <PlusCircle size={40} className="mb-4" />
//             <h3 className="text-2xl font-bold">Create Offer</h3>
//             <p className="text-blue-100 mt-2">Share an unused coupon</p>
//           </Link>

//           <Link href="/dashboard/browse-offers" className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
//             <Search size={40} className="mb-4" />
//             <h3 className="text-2xl font-bold">Browse Offers</h3>
//             <p className="text-purple-100 mt-2">Find coupons to claim</p>
//           </Link>

//           <Link href="/dashboard/claimed-offers" className="bg-gradient-to-br from-green-500 to-green-600 text-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
//             <Award size={40} className="mb-4" />
//             <h3 className="text-2xl font-bold">Claimed Offers</h3>
//             <p className="text-green-100 mt-2">View your claims</p>
//           </Link>

//           <Link href="/dashboard/profile" className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
//             <User size={40} className="mb-4" />
//             <h3 className="text-2xl font-bold">Profile</h3>
//             <p className="text-orange-100 mt-2">Manage your account</p>
//           </Link>
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
import { PlusCircle, Search, Award, User, LogOut } from 'lucide-react'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [offerCount, setOfferCount] = useState(0)
  const router = useRouter()

  useEffect(() => {
    checkUser()
    getOfferCount()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) router.push('/login')
    else setUser(user)
  }

  const getOfferCount = async () => {
    const { count } = await supabase
      .from('offers')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'available')
    setOfferCount(count || 0)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      {/* Background glows */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.25),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(56,189,248,0.18),_transparent_55%)]"
        aria-hidden="true"
      />

      {/* Top Nav */}
      <nav className="border-b border-white/5 bg-slate-950/70 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <span className="relative flex items-center justify-center h-10 w-10 rounded-2xl overflow-hidden ">
                <img
                  src="/logo.svg"
                  alt="Xchange Logo"
                  className="h-8 w-8 object-contain"
                  style={{ minHeight: 24, minWidth: 24 }}
                />
              </span>
              {/* <span className="sr-only">Home</span> */}
            </Link>
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
                Dashboard
              </span>
              <h1 className="text-lg font-semibold tracking-tight text-slate-50">
                Xchange
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs sm:text-sm">
            {/* {user && (
              <span className="hidden sm:inline text-slate-400">
                Signed in as <span className="text-slate-200">{user.name}</span>
              </span>
            )} */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/70 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-slate-300 hover:border-rose-500/70 hover:text-rose-100 hover:bg-slate-900 transition"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="flex-1 w-full">
        <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
          {/* Hero / Welcome */}
          <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-300/80">
                Welcome back
              </p>
              <h2 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-slate-50">
                Let&apos;s share some savings.
              </h2>
              <p className="mt-2 text-sm text-slate-400 max-w-md">
                Create new offers, explore what others have shared, and keep track of
                everything you&apos;ve claimed — all in one glossy dashboard.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 blur-xl bg-violet-500/40" />
                <div className="relative flex items-center gap-3 rounded-2xl border border-violet-500/50 bg-slate-900/80 px-4 py-3 shadow-[0_16px_40px_rgba(109,40,217,0.75)]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-indigo-500">
                    <Search className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] uppercase tracking-[0.2em] text-violet-100/80">
                      Live offers
                    </span>
                    <span className="text-xl font-semibold text-white">
                      {offerCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Action Grid */}
          <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Card base styles reusable via template literal */}
            <Link
              href="/dashboard/create-offer"
              className="group relative overflow-hidden rounded-3xl border border-white/5 bg-slate-900/70 px-6 py-7 shadow-[0_24px_60px_rgba(15,23,42,0.95)] backdrop-blur-2xl transition hover:border-violet-500/70 hover:shadow-[0_30px_90px_rgba(109,40,217,0.9)]"
            >
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-violet-500/40 via-fuchsia-500/40 to-indigo-500/10 blur-2xl opacity-70 group-hover:opacity-100 transition" />
              <div className="relative flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="relative">
                    <div className="absolute inset-0 blur-xl bg-violet-500/40" />
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-indigo-500">
                      <PlusCircle className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <span className="rounded-full border border-violet-400/40 bg-violet-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-violet-100">
                    New
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-50">
                    Create Offer
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Turn unused coupons into rewards for someone else.
                  </p>
                </div>
                <span className="mt-2 inline-flex items-center text-xs font-medium text-violet-200/90">
                  Start sharing
                  <span className="ml-1 transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </div>
            </Link>

            <Link
              href="/dashboard/browse-offers"
              className="group relative overflow-hidden rounded-3xl border border-white/5 bg-slate-900/70 px-6 py-7 shadow-[0_24px_60px_rgba(15,23,42,0.95)] backdrop-blur-2xl transition hover:border-sky-400/70 hover:shadow-[0_30px_90px_rgba(56,189,248,0.7)]"
            >
              <div className="pointer-events-none absolute -left-12 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-sky-400/40 via-violet-500/30 to-transparent blur-2xl opacity-70 group-hover:opacity-100 transition" />
              <div className="relative flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="relative">
                    <div className="absolute inset-0 blur-xl bg-sky-400/40" />
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 via-violet-500 to-indigo-500">
                      <Search className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-sky-100/80">
                    Discover
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-50">
                    Browse Offers
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Explore community deals ready for you to claim.
                  </p>
                </div>
                <span className="mt-2 inline-flex items-center text-xs font-medium text-sky-100/90">
                  View available offers
                  <span className="ml-1 transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </div>
            </Link>

            <Link
              href="/dashboard/claimed-offers"
              className="group relative overflow-hidden rounded-3xl border border-white/5 bg-slate-900/70 px-6 py-7 shadow-[0_24px_60px_rgba(15,23,42,0.95)] backdrop-blur-2xl transition hover:border-emerald-400/70 hover:shadow-[0_30px_90px_rgba(16,185,129,0.7)]"
            >
              <div className="pointer-events-none absolute -right-12 -bottom-10 h-32 w-32 rounded-full bg-gradient-to-br from-emerald-400/40 via-sky-400/30 to-transparent blur-2xl opacity-70 group-hover:opacity-100 transition" />
              <div className="relative flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="relative">
                    <div className="absolute inset-0 blur-xl bg-emerald-400/40" />
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 via-sky-400 to-teal-500">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-100/80">
                    History
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-50">
                    Claimed Offers
                  </h3>
                <p className="mt-1 text-sm text-slate-400">
                    Track everything you&apos;ve saved so far.
                  </p>
                </div>
                <span className="mt-2 inline-flex items-center text-xs font-medium text-emerald-100/90">
                  View your rewards
                  <span className="ml-1 transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </div>
            </Link>

            <Link
              href="/dashboard/profile"
              className="group relative overflow-hidden rounded-3xl border border-white/5 bg-slate-900/70 px-6 py-7 shadow-[0_24px_60px_rgba(15,23,42,0.95)] backdrop-blur-2xl transition hover:border-amber-400/70 hover:shadow-[0_30px_90px_rgba(251,191,36,0.7)]"
            >
              <div className="pointer-events-none absolute -left-12 -bottom-10 h-32 w-32 rounded-full bg-gradient-to-br from-amber-400/40 via-fuchsia-500/25 to-transparent blur-2xl opacity-70 group-hover:opacity-100 transition" />
              <div className="relative flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="relative">
                    <div className="absolute inset-0 blur-xl bg-amber-400/40" />
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500">
                      <User className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-amber-100/80">
                    Profile
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-50">
                    Your Account
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Update your details and manage your identity.
                  </p>
                </div>
                <span className="mt-2 inline-flex items-center text-xs font-medium text-amber-100/90">
                  Manage settings
                  <span className="ml-1 transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </div>
            </Link>
          </section>
        </div>
      </main>
    </div>
  )
}
