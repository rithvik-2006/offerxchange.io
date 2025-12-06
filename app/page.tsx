// import Link from 'next/link'
// import { Gift, Users, Shield } from 'lucide-react'

// export default function Home() {
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
//       <nav className="p-6 flex justify-between items-center">
//         <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Xchange</h1>
//         <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
//           Login
//         </Link>
//       </nav>

//       <main className="container mx-auto px-4 py-20 text-center">
//         <h2 className="text-5xl font-bold mb-6">Share Coupons, Save Money</h2>
//         <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
//           Don't let your unused coupons expire. Share them with others and claim offers you need.
//         </p>

//         <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-16">
//           <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
//             <Gift className="w-12 h-12 text-blue-600 mx-auto mb-4" />
//             <h3 className="text-xl font-semibold mb-2">Share Offers</h3>
//             <p className="text-gray-600 dark:text-gray-400">Post unused coupons before they expire</p>
//           </div>
//           <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
//             <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
//             <h3 className="text-xl font-semibold mb-2">Browse & Claim</h3>
//             <p className="text-gray-600 dark:text-gray-400">Find offers that save you money</p>
//           </div>
//           <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
//             <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
//             <h3 className="text-xl font-semibold mb-2">Secure Claims</h3>
//             <p className="text-gray-600 dark:text-gray-400">One claim per offer guaranteed</p>
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }


import Link from 'next/link'
import { Gift, Users, Shield } from 'lucide-react'

export default function Home() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      {/* Background glows – same vibe as the other pages */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_left,_rgba(139,92,246,0.45),_transparent_55%),radial-gradient(circle_at_bottom_right,_rgba(45,212,191,0.28),_transparent_55%)]"
        aria-hidden="true"
      />

      {/* Top nav */}
      <nav className="px-8 pt-6 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-indigo-500 shadow-md shadow-violet-500/60">
            <span className="text-xs font-semibold tracking-[0.18em] uppercase">
              X
            </span>
          </div> */}
          <Link href="/">
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
            <span className="text-[10px] uppercase tracking-[0.26em] text-slate-400">
              Coupon exchange
            </span>
            <h1 className="text-lg font-semibold tracking-tight text-slate-50">
              Xchange
            </h1>
          </div>
        </div>

        <Link
          href="/login"
          className="rounded-2xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 px-6 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-[0_14px_35px_rgba(109,40,217,0.85)] hover:brightness-110 transition"
        >
          Login
        </Link>
      </nav>

      {/* Main hero */}
      <main className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-5xl mx-auto space-y-12">
          {/* Hero card */}
          <section className="relative rounded-3xl border border-white/10 bg-slate-900/80 px-6 py-10 sm:px-10 sm:py-14 text-center shadow-[0_24px_60px_rgba(15,23,42,0.95)] backdrop-blur-2xl">
            <div className="pointer-events-none absolute inset-x-16 -top-px h-px bg-gradient-to-r from-transparent via-violet-500/70 to-transparent" />

            <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-slate-50 mb-4">
              Share Coupons, Save Money
            </h2>
            <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto mb-8">
              Don&apos;t let your unused coupons expire. Share them with others and claim
              offers you need.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              <span className="rounded-full border border-violet-400/60 bg-violet-500/10 px-4 py-1">
                Share offers
              </span>
              <span className="rounded-full border border-sky-400/60 bg-sky-500/10 px-4 py-1">
                Browse &amp; claim
              </span>
              <span className="rounded-full border border-emerald-400/60 bg-emerald-500/10 px-4 py-1">
                Secure claims
              </span>
            </div>
          </section>

          {/* Feature cards */}
          <section className="grid gap-6 md:grid-cols-3">
            <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 px-6 py-6 shadow-[0_18px_45px_rgba(15,23,42,0.9)] backdrop-blur-2xl">
              <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-gradient-to-br from-violet-500/35 via-fuchsia-500/25 to-sky-500/10 blur-3xl opacity-80 group-hover:opacity-100 transition" />
              <div className="relative flex flex-col items-center text-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-indigo-500 shadow-md shadow-violet-500/70 mb-1">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-50">Share Offers</h3>
                <p className="text-sm text-slate-400">
                  Post unused coupons before they expire and help someone else save.
                </p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 px-6 py-6 shadow-[0_18px_45px_rgba(15,23,42,0.9)] backdrop-blur-2xl">
              <div className="pointer-events-none absolute -left-16 -top-16 h-32 w-32 rounded-full bg-gradient-to-br from-sky-400/35 via-violet-500/25 to-transparent blur-3xl opacity-80 group-hover:opacity-100 transition" />
              <div className="relative flex flex-col items-center text-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 via-violet-500 to-indigo-500 shadow-md shadow-sky-400/70 mb-1">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-50">Browse &amp; Claim</h3>
                <p className="text-sm text-slate-400">
                  Discover community offers tailored to what you actually need.
                </p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 px-6 py-6 shadow-[0_18px_45px_rgba(15,23,42,0.9)] backdrop-blur-2xl">
              <div className="pointer-events-none absolute -right-16 -bottom-16 h-32 w-32 rounded-full bg-gradient-to-br from-emerald-400/35 via-sky-400/25 to-transparent blur-3xl opacity-80 group-hover:opacity-100 transition" />
              <div className="relative flex flex-col items-center text-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 via-sky-400 to-teal-500 shadow-md shadow-emerald-400/70 mb-1">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-50">Secure Claims</h3>
                <p className="text-sm text-slate-400">
                  One claim per offer, protected by your account and clean rules.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
