'use client'

import React from "react"

import Image from 'next/image'

const metals = [
  {
    name: 'Gold',
    symbol: 'XAU',
    ticker: 'APX-G',
    price: '$2,342.50',
    change: '+1.24%',
    allocation: '60%',
    color: '#D4AF37',
    purity: '999.9 Fine',
    custodian: 'Brinks London',
    description: 'Primary store of value. Allocated gold bars held in segregated LBMA vaults with full insurance coverage.'
  },
  {
    name: 'Silver',
    symbol: 'XAG',
    ticker: 'APX-S',
    price: '$27.85',
    change: '+0.82%',
    allocation: '30%',
    color: '#C0C0C0',
    purity: '999.0 Fine',
    custodian: 'Brinks Zurich',
    description: 'Industrial and monetary metal. Growing demand from renewable energy sector provides upside potential.'
  },
  {
    name: 'Platinum',
    symbol: 'XPT',
    ticker: 'APX-P',
    price: '$1,024.30',
    change: '+0.47%',
    allocation: '10%',
    color: '#E5E4E2',
    purity: '999.5 Fine',
    custodian: 'Malca-Amit Singapore',
    description: 'Rarest of the three. Strategic exposure to automotive catalytic converter demand and jewelry markets.'
  },
]

export function MetalsSection() {
  return (
    <section id="metals" className="py-28 bg-radial-obsidian border-t border-[#1A1A1A]">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <p className="text-xs text-[#D4AF37] uppercase tracking-[0.2em] mb-4">Underlying Assets</p>
          <h2 className="text-3xl md:text-4xl font-serif text-[#E8E8E8] mb-6 leading-tight">
            APX-i Composition
          </h2>
          <p className="text-[#888888] leading-relaxed">
            A weighted basket of three precious metals, rebalanced quarterly. 
            Each holding is independently audited and fully allocated in your name.
          </p>
        </div>

        {/* Hero Image - Full width */}
        <div className="relative mb-16 rounded-sm overflow-hidden border border-[#1A1A1A]">
          <Image
            src="/images/apax-hero.png"
            alt="APAX Precious Metals Vault"
            width={1200}
            height={500}
            className="w-full h-auto object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/30 to-transparent" />
          
          {/* Overlay stats */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-6">
            <div className="glass-heavy px-4 py-3 rounded-sm">
              <p className="text-[10px] text-[#888888] uppercase tracking-wider mb-1">Total Weight</p>
              <p className="text-lg font-mono text-[#D4AF37]">54,328 kg</p>
            </div>
            <div className="glass-heavy px-4 py-3 rounded-sm">
              <p className="text-[10px] text-[#888888] uppercase tracking-wider mb-1">Vault Locations</p>
              <p className="text-lg font-mono text-[#C0C0C0]">3 Jurisdictions</p>
            </div>
            <div className="glass-heavy px-4 py-3 rounded-sm">
              <p className="text-[10px] text-[#888888] uppercase tracking-wider mb-1">Insurance</p>
              <p className="text-lg font-mono text-[#E5E4E2]">Lloyds Syndicate</p>
            </div>
          </div>
        </div>

        {/* Metal Cards - Asymmetric heights */}
        <div className="grid md:grid-cols-3 gap-6">
          {metals.map((metal, index) => (
            <div 
              key={metal.symbol}
              className={`group relative p-6 rounded-sm bg-[#111111] border border-[#1A1A1A] hover:border-opacity-30 transition-vault overflow-hidden ${
                index === 1 ? 'md:translate-y-6' : ''
              }`}
              style={{ '--border-hover': metal.color } as React.CSSProperties}
            >
              {/* Subtle glow on hover */}
              <div 
                className="absolute -top-24 -right-24 w-48 h-48 rounded-full opacity-0 blur-3xl group-hover:opacity-10 transition-vault"
                style={{ backgroundColor: metal.color }}
              />

              {/* Header row */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: metal.color }}
                    />
                    <span className="text-xs font-mono text-[#888888]">{metal.ticker}</span>
                  </div>
                  <h3 className="text-xl font-serif text-[#E8E8E8]">{metal.name}</h3>
                </div>
                
                {/* Price badge */}
                <div className="text-right">
                  <p className="text-lg font-mono" style={{ color: metal.color }}>{metal.price}</p>
                  <p className="text-xs text-emerald-500">{metal.change}</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-[#888888] leading-relaxed mb-6">{metal.description}</p>

              {/* Data grid */}
              <div className="grid grid-cols-2 gap-4 pt-5 border-t border-[#1A1A1A]">
                <div>
                  <p className="text-[10px] text-[#888888] uppercase tracking-wider mb-1">Allocation</p>
                  <p className="text-sm font-mono text-[#E8E8E8]">{metal.allocation}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#888888] uppercase tracking-wider mb-1">Purity</p>
                  <p className="text-sm font-mono text-[#E8E8E8]">{metal.purity}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] text-[#888888] uppercase tracking-wider mb-1">Custodian</p>
                  <p className="text-sm font-mono" style={{ color: metal.color }}>{metal.custodian}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
