import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import './start'

const _inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter'
});
const _playfair = Playfair_Display({
  subsets: ["latin"],
  variable: '--font-playfair'
});
const _geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: '--font-geist-mono'
});

export const metadata: Metadata = {
  title: 'APAX - The Precious Metal Token Vault',
  description: 'The world\'s first RWA-Compliant Real World Asset (RWA) platform. Tokenized Gold, Silver, and Platinum on SidraChain.',
  generator: 'APAX',
  keywords: ['APAX', 'precious metals', 'tokenization', 'gold', 'silver', 'platinum', 'Islamic finance', 'RWA-Compliant', 'RWA', 'SidraChain'],
  authors: [{ name: 'APAX' }],
  icons: {
    icon: [
      {
        url: '/apax-logo.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/apax-logo.png',
        media: '(prefers-color-scheme: dark)',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#D4AF37',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased bg-[#0A0A0A] text-[#E8E8E8]">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
