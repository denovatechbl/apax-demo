'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Lightning,
  ShieldCheck,
  TrendUp,
  Bank,
  Wallet,
} from '@phosphor-icons/react'

export function HeroSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-radial-obsidian">
      {/* Subtle grid pattern - not distracting */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#D4AF37 1px, transparent 1px), linear-gradient(90deg, #D4AF37 1px, transparent 1px)`,
            backgroundSize: '80px 80px'
          }}
        />
        {/* Ambient gold glow */}
        <div className="absolute top-1/3 left-1/3 w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 lg:px-8 pt-28 pb-20 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          {/* Left: Content - spans 7 cols */}
          <div className={`lg:col-span-7 space-y-10 ${mounted ? 'animate-in fade-in slide-in-from-left-8 duration-700' : 'opacity-0'}`}>
            {/* Regulatory Badge */}
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-sm border border-[#D4AF37]/20 bg-[#D4AF37]/5">
              <ShieldCheck weight="light" className="w-4 h-4 text-[#D4AF37] icon-bespoke" />
              <span className="text-xs tracking-wider text-[#C0C0C0] uppercase">
                Certified | International Standards Compliant
              </span>
            </div>

            {/* Heading - Institutional Copy */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-serif leading-[1.1] tracking-tight">
                <span className="text-[#E8E8E8]">Secure your capital in</span>
                <br />
                <span className="text-gradient-gold">audited, physically-backed</span>
                <br />
                <span className="text-[#E8E8E8]">precious metals.</span>
              </h1>
              <p className="text-lg text-[#888888] max-w-xl leading-relaxed text-data">
                Directly own allocated Gold, Silver, and Platinum stored in LBMA-accredited vaults.
                APAX tokens provide a bankruptcy-remote legal claim to physical metal, eliminating the counterparty risks inherent in ETFs and unallocated accounts.
              </p>
            </div>

            {/* Key Metrics - Not a "list of three" */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-2">
              <div className="space-y-1">
                <p className="text-2xl font-serif text-[#D4AF37]">$127.4M</p>
                <p className="text-xs text-[#888888] uppercase tracking-wide">AUM</p>
              </div>
              <div className="space-y-1 card-offset-1">
                <p className="text-2xl font-serif text-[#C0C0C0]">14,892</p>
                <p className="text-xs text-[#888888] uppercase tracking-wide">Investors</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-serif text-[#E5E4E2]">100%</p>
                <p className="text-xs text-[#888888] uppercase tracking-wide">Backed</p>
              </div>
              <div className="space-y-1 card-offset-1">
                <p className="text-2xl font-serif text-emerald-500">Live</p>
                <p className="text-xs text-[#888888] uppercase tracking-wide">Audit Feed</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/login">
                <Button
                  size="lg"
                  className="metallic-shine gradient-gold-5 text-[#0A0A0A] font-semibold px-8 h-12 transition-vault hover:opacity-90"
                >
                  Become a Client
                </Button>
              </Link>
              <a href="#reserve-data">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[#2A2A2A] text-[#C0C0C0] hover:bg-[#1A1A1A] hover:border-[#D4AF37]/30 px-8 h-12 bg-transparent transition-vault"
                >
                  View Reserve Data
                </Button>
              </a>
            </div>
          </div>

          {/* Right: Visual - spans 5 cols */}
          <div className={`lg:col-span-5 flex justify-center ${mounted ? 'animate-in fade-in slide-in-from-right-8 duration-700 delay-200' : 'opacity-0'}`}>
            <div className="relative">
              {/* Ambient glow */}
              <div className="absolute inset-0 bg-[#D4AF37]/10 rounded-full blur-[80px] scale-90" />

              {/* Token visual with Radar/Orbital Scan */}
              <div className="relative float-subtle">
                {/* Radar Scan Circles */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-[450px] h-[450px] rounded-full border border-[#D4AF37]/10 animate-radar" />
                  <div className="w-[350px] h-[350px] rounded-full border border-[#D4AF37]/5 animate-spin-slow-reverse" />

                  {/* Radar Sweeper */}
                  <div className="absolute inset-0 animate-radar">
                    <div className="absolute top-1/2 left-1/2 w-1/2 h-1 bg-gradient-to-r from-[#D4AF37]/30 to-transparent -translate-y-1/2 origin-left blur-sm" />
                  </div>
                </div>

                <Image
                  src="/images/apax-logo.png"
                  alt="APAX Token"
                  width={380}
                  height={380}
                  className="relative z-10 drop-shadow-2xl"
                  priority
                />
              </div>

              {/* Data Cards - Asymmetric placement */}
              <div className="absolute -top-6 -left-4 glass-heavy rounded-sm p-4 border-gold-subtle" style={{ transform: 'rotate(-2deg)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-sm bg-[#D4AF37]/10 flex items-center justify-center">
                    <TrendUp weight="light" className="w-4 h-4 text-[#D4AF37] icon-bespoke" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#888888] uppercase tracking-wider">XAU Spot</p>
                    <p className="text-sm font-mono text-[#D4AF37]">$2,342.50</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-6 glass-heavy rounded-sm p-4 border-gold-subtle" style={{ transform: 'rotate(1deg)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-sm bg-emerald-500/10 flex items-center justify-center">
                    <Bank weight="light" className="w-4 h-4 text-emerald-500 icon-bespoke" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#888888] uppercase tracking-wider">Vault Status</p>
                    <p className="text-sm font-mono text-emerald-500">Verified</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator - minimal */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <div className="w-5 h-8 rounded-full border border-[#2A2A2A] flex items-start justify-center p-1.5">
          <div className="w-1 h-2 bg-[#D4AF37]/50 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  )
}
