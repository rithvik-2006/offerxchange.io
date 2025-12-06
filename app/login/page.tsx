// 'use client'
// import { useState } from 'react'
// import { supabase } from '@/lib/supabase'
// import { useRouter } from 'next/navigation'

// export default function Login() {
//   const [email, setEmail] = useState('')
//   const [loading, setLoading] = useState(false)
//   const router = useRouter()

//   const handleGoogleLogin = async () => {
//     setLoading(true)
//     await supabase.auth.signInWithOAuth({
//       provider: 'google',
//       options: { redirectTo: `${window.location.origin}/dashboard` }
//     })
//   }

//   const handleEmailLogin = async () => {
//     setLoading(true)
//     const { error } = await supabase.auth.signInWithOtp({ email })
//     if (!error) alert('Check your email for login link!')
//     setLoading(false)
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
//       <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md">
//         <h2 className="text-3xl font-bold mb-6 text-center">Welcome to Xchange</h2>
        
//         <button
//           onClick={handleGoogleLogin}
//           disabled={loading}
//           className="w-full bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-3 rounded-lg font-semibold mb-4 hover:bg-gray-50 dark:hover:bg-gray-600"
//         >
//           Continue with Google
//         </button>

//         <div className="relative my-6">
//           <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300 dark:border-gray-600"></div></div>
//           <div className="relative flex justify-center text-sm"><span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or</span></div>
//         </div>

//         <input
//           type="email"
//           placeholder="Enter your email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 bg-white dark:bg-gray-700"
//         />
//         <button
//           onClick={handleEmailLogin}
//           disabled={loading}
//           className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
//         >
//           Send Magic Link
//         </button>
//       </div>
//     </div>
//   )
// }


'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { LogIn } from 'lucide-react'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleGoogleLogin = async () => {
    setLoading(true)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` }
    })
  }

  const handleEmailLogin = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (!error) alert('Check your email for login link!')
    setLoading(false)
  }

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      {/* background glows */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_left,_rgba(139,92,246,0.45),_transparent_55%),radial-gradient(circle_at_bottom_right,_rgba(45,212,191,0.28),_transparent_55%)]"
        aria-hidden="true"
      />

      {/* top mini-nav */}
      <nav className="border-b border-white/5 bg-slate-950/70 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
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
            
          </div>
        </div>
      </nav>

      {/* center card */}
      <main className="flex-1 flex items-center justify-center px-4 pb-10">
        <div className="relative w-full max-w-md rounded-3xl bg-slate-900/80 border border-white/8 shadow-[0_0_80px_rgba(109,40,217,0.7)] backdrop-blur-2xl px-7 py-8 sm:px-9 sm:py-10">
          {/* top highlight */}
          <div className="pointer-events-none absolute inset-x-10 -top-px h-px bg-gradient-to-r from-transparent via-violet-500/70 to-transparent" />

          {/* header */}
          <div className="flex flex-col items-center gap-3 mb-8">
            <div className="relative">
              <div className="absolute inset-0 blur-xl bg-violet-500/40" />
              {/* <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-indigo-500 shadow-md shadow-violet-500/70">
                <LogIn className="h-6 w-6 text-white" />
              </div> */}
              
              <span className="relative flex items-center justify-center h-10 w-10 rounded-2xl overflow-hidden ">
                <img
                  src="/logo.svg"
                  alt="Xchange Logo"
                  className="h-12 w-12 object-contain"
                  style={{ minHeight: 24, minWidth: 24 }}
                />
              </span>
              {/* <span className="sr-only">Home</span> */}
            
            </div>
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-50">
                Welcome to Xchange
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Sign in to share coupons and claim new offers.
              </p>
            </div>
          </div>

          {/* Google login */}
         {/* Google login */}
<button
  onClick={handleGoogleLogin}
  disabled={loading}
  className="w-full rounded-xl border border-white/12 bg-[#050816]/80 px-4 py-3 text-sm font-semibold text-slate-100 shadow-[0_0_0_1px_rgba(15,23,42,0.9)] hover:border-violet-400/70 hover:bg-slate-900/90 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
>
  <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-white">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 640"
      className="h-3.5 w-3.5 fill-slate-900"
      aria-hidden="true"
    >
      <path d="M564 325.8C564 467.3 467.1 568 324 568C186.8 568 76 457.2 76 320C76 182.8 186.8 72 324 72C390.8 72 447 96.5 490.3 136.9L422.8 201.8C334.5 116.6 170.3 180.6 170.3 320C170.3 406.5 239.4 476.6 324 476.6C422.2 476.6 459 406.2 464.8 369.7L324 369.7L324 284.4L560.1 284.4C562.4 297.1 564 309.3 564 325.8z" />
    </svg>
  </span>
  <span>Continue with Google</span>
</button>


          {/* divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700/70" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-slate-900/80 px-3 text-[11px] uppercase tracking-[0.22em] text-slate-500">
                or use email
              </span>
            </div>
          </div>

          {/* email input */}
          <div className="space-y-2 mb-4">
            <label
              htmlFor="email"
              className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-700/80 bg-[#050816]/80 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none shadow-[0_0_0_1px_rgba(15,23,42,0.9)] focus:border-violet-500/80 focus:shadow-[0_0_0_1px_rgba(139,92,246,0.8)] focus:ring-2 focus:ring-violet-500/70"
            />
          </div>

          {/* magic link button */}
          <button
            onClick={handleEmailLogin}
            disabled={loading || !email}
            className="w-full rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(109,40,217,0.8)] hover:brightness-110 hover:shadow-[0_22px_55px_rgba(109,40,217,0.95)] transition disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {loading ? 'Sending…' : 'Send Magic Link'}
          </button>

          {/* tiny footer text */}
          <p className="mt-4 text-[11px] text-center text-slate-500">
            By continuing, you agree to our very serious mission of stopping coupons from expiring
            alone.
          </p>
        </div>
      </main>
    </div>
  )
}
