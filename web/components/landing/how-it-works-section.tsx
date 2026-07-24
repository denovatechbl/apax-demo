'use client'

import {
  Wallet,
  IdentificationCard,
  Coin,
  Package,
} from '@phosphor-icons/react'

const steps = [
  {
    icon: Wallet,
    number: '01',
    title: 'Connect',
    description: 'Link your SidraChain-compatible wallet. Multi-signature support available for institutional accounts.',
    detail: 'KYC/AML verification required'
  },
  {
    icon: IdentificationCard,
    number: '02',
    title: 'Verify',
    description: 'Complete identity verification to satisfy regulatory requirements and enable full platform access.',
    detail: 'Tier-based limits apply'
  },
  {
    icon: Coin,
    number: '03',
    title: 'Acquire',
    description: 'Purchase APX tokens. Each token grants direct ownership claim to physical metal held in custody.',
    detail: '1 APX = 1 gram backing'
  },
  {
    icon: Package,
    number: '04',
    title: 'Redeem',
    description: 'Convert tokens to physical delivery at any time. LBMA-certified bars shipped via secure courier.',
    detail: 'Minimum 100g per redemption'
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-28 bg-[#0A0A0A] border-t border-[#1A1A1A]">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-20">
          <p className="text-xs text-[#D4AF37] uppercase tracking-[0.2em] mb-4">Process</p>
          <h2 className="text-3xl md:text-4xl font-serif text-[#E8E8E8] mb-6 leading-tight">
            From digital ownership<br />to physical delivery.
          </h2>
          <p className="text-[#888888] leading-relaxed">
            An engineered acquisition framework ensuring strict chain of custody.
            The protocol enforces regulatory compliance while preserving the efficiency of distributed ledger settlement.
          </p>
        </div>

        {/* Steps - Asymmetric grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`group relative ${index % 2 === 1 ? 'lg:translate-y-8' : ''}`}
            >
              {/* Connector line - desktop only */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-14 left-full w-4 h-px bg-[#2A2A2A] z-0" />
              )}

              <div className="relative p-6 rounded-sm bg-[#111111] border border-[#1A1A1A] hover:border-[#D4AF37]/20 transition-vault group-hover:-translate-y-1">
                {/* Number badge */}
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-sm gradient-gold-5 flex items-center justify-center shadow-lg">
                  <span className="text-xs font-mono font-bold text-[#0A0A0A]">{step.number}</span>
                </div>

                {/* Icon */}
                <div className="w-12 h-12 rounded-sm bg-[#0A0A0A] border border-[#2A2A2A] flex items-center justify-center mb-5 group-hover:border-[#D4AF37]/30 transition-vault">
                  <step.icon weight="light" className="w-5 h-5 text-[#D4AF37] icon-bespoke" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-serif text-[#E8E8E8] mb-3">{step.title}</h3>
                <p className="text-sm text-[#888888] leading-relaxed mb-4">{step.description}</p>

                {/* Detail tag */}
                <div className="inline-block px-2 py-1 bg-[#0A0A0A] rounded-sm">
                  <span className="text-[10px] text-[#D4AF37]/70 uppercase tracking-wider">{step.detail}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
