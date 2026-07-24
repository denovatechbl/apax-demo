'use client'

import Image from 'next/image'
import Link from 'next/link'

function IconMail({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 6L12 13 2 6" />
    </svg>
  )
}

function IconTwitter({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 4l11.7 16h4.3L8.3 4H4z" />
      <path d="M4 20l6.3-8.5M20 4l-6.3 8.5" />
    </svg>
  )
}

function IconLinkedIn({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="2" width="20" height="20" rx="2" />
      <path d="M8 11v5M8 8v.01M12 16v-5c0-1 1-2 2-2s2 1 2 2v5" />
    </svg>
  )
}

const footerLinks = {
  platform: [
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Asset Composition', href: '#metals' },
    { label: 'Reserve Data', href: '#reserve-data' },
    { label: 'API Documentation', href: '#' },
  ],
  company: [
    { label: 'About APAX', href: '#' },
    { label: 'Governance', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Press', href: '#' },
  ],
  legal: [
    { label: 'Terms of Service', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Risk Disclosure', href: '#' },
    { label: 'Third-Party Certification', href: '#' },
  ],
}

const socialLinks = [
  { icon: IconTwitter, href: '#', label: 'Twitter' },
  { icon: IconLinkedIn, href: '#', label: 'LinkedIn' },
  { icon: IconMail, href: '#', label: 'Email' },
]

export function LandingFooter() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-[#1A1A1A] pt-20 pb-10">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-5">
              <Image
                src="/images/apax-logo.png"
                alt="APAX"
                width={36}
                height={36}
                className="rounded-sm"
              />
              <span className="text-lg font-serif text-gradient-gold">APAX</span>
            </Link>
            <p className="text-sm text-[#888888] max-w-sm mb-6 leading-relaxed">
              Institutional-grade access to precious metals. 
              Tokenized ownership with full redemption rights. 
              Built on SidraChain.
            </p>
            
            {/* Social links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-9 h-9 rounded-sm bg-[#111111] border border-[#1A1A1A] flex items-center justify-center hover:border-[#D4AF37]/30 transition-vault"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4 text-[#888888]" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-medium text-[#C0C0C0] uppercase tracking-[0.15em] mb-5">Platform</h4>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-[#888888] hover:text-[#D4AF37] transition-vault">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-medium text-[#C0C0C0] uppercase tracking-[0.15em] mb-5">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-[#888888] hover:text-[#D4AF37] transition-vault">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-medium text-[#C0C0C0] uppercase tracking-[0.15em] mb-5">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-[#888888] hover:text-[#D4AF37] transition-vault">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[#1A1A1A] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#888888]">
            {new Date().getFullYear()} APAX Holdings Ltd. All rights reserved.
          </p>
          <p className="text-xs text-[#888888]">
            Built on <span className="text-[#D4AF37]">SidraChain</span> | 
            <span className="text-[#888888]"> Dubai, UAE</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
