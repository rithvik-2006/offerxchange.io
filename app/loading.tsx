'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

const QUOTES = [
  "Optimizing coupons... and your life choices.",
  "Teaching servers how to be more generous with discounts.",
  "Bribing the database with extra RAM.",
  "Loading savings… because inflation won’t.",
  "Assembling offers… some assembly required.",
  "Spinning up deals faster than your washing machine.",
  "Convincing APIs to stop taking coffee breaks.",
  "Making sure your coupons don’t expire while we load. Hopefully.",
  "Shhh… the coupons think you paid full price.",
  "Turning unused coupons into main-character energy."
]

export default function Loading() {
  const [quoteIndex, setQuoteIndex] = useState(() =>
    Math.floor(Math.random() * QUOTES.length)
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex(prev => (prev + 1) % QUOTES.length)
    }, 3500)

    return () => clearInterval(interval)
  }, [])

  const quote = QUOTES[quoteIndex]

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
      {/* Background glows – same vibe as other pages */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_left,_rgba(139,92,246,0.45),_transparent_55%),radial-gradient(circle_at_bottom_right,_rgba(45,212,191,0.28),_transparent_55%)]"
        aria-hidden="true"
      />

      {/* Center card */}
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900/80 border border-white/8 shadow-[0_0_80px_rgba(109,40,217,0.7)] backdrop-blur-2xl px-8 py-10 flex flex-col items-center gap-6">
        {/* top highlight line */}
        <div className="pointer-events-none absolute inset-x-10 -top-px h-px bg-gradient-to-r from-transparent via-violet-500/70 to-transparent" />

        {/* Logo + spinner */}
        <div className="relative flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 blur-xl bg-violet-500/40" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-950/60 border border-violet-500/50 shadow-[0_18px_45px_rgba(109,40,217,0.8)]">
              {/* Use your logo from /public/logo.svg */}
              <Image
                src="/logo.svg"          // make sure logo.svg is in /public
                alt="Xchange logo"
                width={52}
                height={52}
                className="animate-pulse"
                priority
              />
            </div>

            {/* circular spinner ring */}
            <div className="pointer-events-none absolute inset-[-8px] rounded-full border-2 border-violet-500/40 border-t-transparent animate-spin" />
          </div>

          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-200/90">
              Xchange
            </p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-50">
              Loading your savings…
            </h2>
          </div>
        </div>

        {/* Quote box */}
        <div className="w-full rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-4 text-sm text-slate-200 text-center shadow-inner">
          <p className="leading-relaxed">{quote}</p>
        </div>

        {/* subtle progress hint */}
        <div className="w-full flex flex-col items-center gap-2">
          <div className="w-32 h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 animate-[pulse_1.4s_ease-in-out_infinite]" />
          </div>
          <p className="text-[11px] tracking-[0.18em] uppercase text-slate-500">
            Please hold the coupon...
          </p>
        </div>
      </div>
    </div>
  )
}
