'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

function IconMenu({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

function IconClose({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 6l12 12M6 18L18 6" />
    </svg>
  )
}

const navLinks = [
  { label: 'Process', href: '#how-it-works' },
  { label: 'Assets', href: '#metals' },
  { label: 'Compliance', href: '#sharia' },
  { label: 'Reserve Data', href: '#reserve-data' },
]

export function LandingHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-vault ${
        isScrolled ? 'glass-heavy py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/apax-logo.png"
            alt="APAX"
            width={40}
            height={40}
            className="rounded-sm"
          />
          <div className="hidden sm:block">
            <span className="text-lg font-serif text-gradient-gold tracking-tight">APAX</span>
            <span className="block text-[9px] text-[#888888] uppercase tracking-[0.15em] -mt-0.5">Precious Metal Vault</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-[#888888] hover:text-[#D4AF37] transition-vault"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA Button */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login">
            <Button className="metallic-shine gradient-gold-5 text-[#0A0A0A] font-semibold px-6 h-10 transition-vault hover:opacity-90">
              Access Terminal
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-[#E8E8E8] p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <IconClose className="w-5 h-5" />
          ) : (
            <IconMenu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-heavy mt-2 mx-4 rounded-sm p-5 border border-[#1A1A1A]">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[#888888] hover:text-[#D4AF37] transition-vault py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 border-t border-[#1A1A1A]">
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full metallic-shine gradient-gold-5 text-[#0A0A0A] font-semibold transition-vault hover:opacity-90">
                  Access Terminal
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
