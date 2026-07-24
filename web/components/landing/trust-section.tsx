'use client'

import {
  Certificate,
  Prohibit,
  Cube,
  Globe,
} from '@phosphor-icons/react'

const auditPartners = [
  { name: 'Bureau Veritas', initials: 'BV' },
  { name: 'Inspectorate', initials: 'IN' },
  { name: 'SGS Group', initials: 'SGS' },
  { name: 'Metalor', initials: 'MT' },
  { name: 'PAMP Suisse', initials: 'PS' },
  { name: 'Argor-Heraeus', initials: 'AH' },
]

const compliancePoints = [
  {
    icon: Certificate,
    title: 'Third-Party Certified',
    description: 'Reviewed and approved by qualified scholars under AAOIFI guidelines. Certification renewed annually.'
  },
  {
    icon: Prohibit,
    title: 'Zero Interest Exposure',
    description: 'The vault maintains a 1:1 allocation ratio with zero rehypothecation or derivative leverage. Value is derived strictly from the underlying physical commodity.'
  },
  {
    icon: Cube,
    title: 'Full Physical Backing',
    description: 'Every token constitutes a bailment of legal title to specific bars. No fractional reserve banking or unallocated paper claims.'
  },
  {
    icon: Globe,
    title: 'Multi-Jurisdictional',
    description: 'Vaults in London, Zurich, and Singapore. Legal structures optimized for each jurisdiction.'
  },
]

export function TrustSection() {
  return (
    <section id="sharia" className="py-28 bg-[#0A0A0A] border-t border-[#1A1A1A]">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Sharia Compliance Badge - Prominent */}
        <div className="flex justify-center mb-20">
          <div className="inline-flex items-center gap-5 px-8 py-5 rounded-sm border border-[#D4AF37]/20 bg-[#D4AF37]/5 gold-glow">
            <div className="w-14 h-14 rounded-sm gradient-gold-5 flex items-center justify-center pulse-verification">
              <Certificate weight="fill" className="w-7 h-7 text-[#0A0A0A]" />
            </div>
            <div>
              <p className="text-[10px] text-[#888888] uppercase tracking-[0.15em] mb-1">Certification Status</p>
              <p className="text-xl font-serif text-[#D4AF37]">RWA-Compliant</p>
            </div>
            <div className="hidden sm:block pl-5 border-l border-[#D4AF37]/20">
              <p className="text-[10px] text-[#888888] uppercase tracking-wider mb-1">Last Review</p>
              <p className="text-sm font-mono text-[#C0C0C0]">Jan 2026</p>
            </div>
          </div>
        </div>

        {/* Compliance Grid - Asymmetric */}
        <div className="grid md:grid-cols-2 gap-6 mb-20">
          {compliancePoints.map((point, index) => (
            <div
              key={point.title}
              className={`group p-6 rounded-sm bg-[#111111] border border-[#1A1A1A] hover:border-[#D4AF37]/15 transition-vault ${index % 2 === 1 ? 'md:translate-y-4' : ''
                }`}
            >
              <div className="flex items-start gap-5">
                <div className="w-11 h-11 rounded-sm bg-[#0A0A0A] border border-[#2A2A2A] flex items-center justify-center shrink-0 group-hover:border-[#D4AF37]/20 transition-vault">
                  <point.icon weight="light" className="w-5 h-5 text-[#D4AF37] icon-bespoke" />
                </div>
                <div>
                  <h3 className="text-base font-serif text-[#E8E8E8] mb-2">{point.title}</h3>
                  <p className="text-sm text-[#888888] leading-relaxed">{point.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Audit Partners Marquee */}
        <div className="relative py-10 border-t border-b border-[#1A1A1A]">
          <div className="text-center mb-8">
            <p className="text-xs text-[#888888] uppercase tracking-[0.2em]">
              Independent Verification Partners
            </p>
          </div>

          <div className="relative flex overflow-hidden">
            <div className="animate-marquee flex items-center gap-20 whitespace-nowrap">
              {[...auditPartners, ...auditPartners].map((partner, index) => (
                <div
                  key={`${partner.name}-${index}`}
                  className="flex items-center gap-3 px-4 opacity-60 hover:opacity-100 transition-opacity"
                >
                  <div className="w-10 h-10 rounded-sm bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center">
                    <span className="text-xs font-mono font-medium text-[#C0C0C0]">{partner.initials}</span>
                  </div>
                  <span className="text-sm text-[#C0C0C0]">{partner.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Gradient overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0A0A0A] to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0A0A0A] to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  )
}
