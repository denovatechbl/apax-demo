'use client'

import Image from 'next/image'
import { Shield, FileText, Download, ExternalLink, CheckCircle, Award, Users, BookOpen } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

const advisoryBoard = [
  {
    name: 'Dr. Muhammad Al-Rashid',
    title: 'Chairman, Sharia Advisory Board',
    credentials: 'PhD Islamic Finance, Al-Azhar University',
    specialty: 'Islamic Commercial Law'
  },
  {
    name: 'Sheikh Abdullah Hassan',
    title: 'Senior Sharia Scholar',
    credentials: 'Grand Mufti, Islamic Finance Council',
    specialty: 'Halal Investments'
  },
  {
    name: 'Dr. Fatima Al-Mahmoud',
    title: 'Sharia Compliance Officer',
    credentials: 'PhD Economics, INCEIF Malaysia',
    specialty: 'RWA Tokenization'
  }
]

const compliancePrinciples = [
  {
    title: 'No Riba (Interest)',
    description: 'All transactions are interest-free. Token value derives solely from underlying metal assets.',
    icon: Shield
  },
  {
    title: 'No Gharar (Uncertainty)',
    description: 'Full transparency with real-time proof-of-reserve and verifiable asset backing.',
    icon: CheckCircle
  },
  {
    title: 'Tangible Asset Backing',
    description: 'Every token represents physical gold, silver, or platinum in secure vaults.',
    icon: Award
  },
  {
    title: 'Ethical Sourcing',
    description: 'All precious metals are ethically sourced and conflict-free certified.',
    icon: BookOpen
  }
]

const documents = [
  {
    title: 'APAX Sharia Compliance Fatwa 2026',
    issuer: 'International Sharia Advisory Board',
    date: 'January 2026',
    type: 'Official Fatwa'
  },
  {
    title: 'Quarterly Compliance Report Q4 2025',
    issuer: 'Al-Qalam Sharia Audit',
    date: 'December 2025',
    type: 'Audit Report'
  },
  {
    title: 'SidraChain Halal Infrastructure Certificate',
    issuer: 'Islamic Finance Council',
    date: 'October 2025',
    type: 'Certificate'
  },
  {
    title: 'Metal Sourcing Ethics Verification',
    issuer: 'Responsible Jewellery Council',
    date: 'November 2025',
    type: 'Verification'
  },
  {
    title: 'Annual Sharia Compliance Summary 2025',
    issuer: 'APAX Sharia Board',
    date: 'December 2025',
    type: 'Summary'
  }
]

export function ShariaView() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#E8E8E8]">
            Sharia Certification Hub
          </h1>
          <p className="text-sm text-[#888888] mt-1">
            Complete transparency on our Islamic finance compliance
          </p>
        </div>
        <Badge 
          variant="outline" 
          className="border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
        >
          <CheckCircle className="h-3 w-3 mr-1" />
          Fully Sharia Compliant
        </Badge>
      </div>

      {/* Hero Banner */}
      <Card className="overflow-hidden border-[#D4AF37]/30">
        <div className="relative h-48 md:h-64">
          <Image
            src="/images/apax-team.png"
            alt="APAX Team with Bullion"
            fill
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent" />
          <div className="absolute inset-0 flex items-center p-8">
            <div className="max-w-xl">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#E8E8E8] mb-3">
                The World&apos;s First RWA-Compliant RWA Platform
              </h2>
              <p className="text-sm text-[#C0C0C0]">
                APAX bridges centuries-old Islamic finance principles with cutting-edge 
                blockchain technology, creating a transparent and ethical ecosystem for 
                precious metal investment.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Compliance Principles */}
      <div>
        <h2 className="text-lg font-semibold text-[#E8E8E8] mb-4">Core Compliance Principles</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {compliancePrinciples.map((principle) => (
            <Card key={principle.title} className="glass border-[#2A2A2A] bg-[#111111]">
              <CardContent className="pt-6">
                <div className="mb-3 p-2 rounded-lg bg-[#D4AF37]/10 w-fit">
                  <principle.icon className="h-5 w-5 text-[#D4AF37]" />
                </div>
                <h3 className="font-medium text-[#E8E8E8] mb-2">{principle.title}</h3>
                <p className="text-xs text-[#888888]">{principle.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Advisory Board */}
      <Card className="glass border-[#2A2A2A] bg-[#111111]">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#B8860B]">
              <Users className="h-5 w-5 text-[#0A0A0A]" />
            </div>
            <div>
              <CardTitle className="text-[#E8E8E8]">Sharia Advisory Board</CardTitle>
              <CardDescription className="text-[#888888]">
                World-renowned scholars ensuring continuous compliance
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {advisoryBoard.map((member) => (
              <div
                key={member.name}
                className="p-4 rounded-lg border border-[#2A2A2A] bg-[#0A0A0A]"
              >
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center mb-3">
                  <span className="text-[#0A0A0A] font-bold text-lg">
                    {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </span>
                </div>
                <h4 className="font-medium text-[#E8E8E8] mb-1">{member.name}</h4>
                <p className="text-xs text-[#D4AF37] mb-2">{member.title}</p>
                <p className="text-xs text-[#888888] mb-1">{member.credentials}</p>
                <Badge variant="outline" className="text-xs border-[#2A2A2A] text-[#888888]">
                  {member.specialty}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Document Vault */}
      <Card className="glass border-[#2A2A2A] bg-[#111111]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#1A1A1A]">
                <FileText className="h-5 w-5 text-[#D4AF37]" />
              </div>
              <div>
                <CardTitle className="text-[#E8E8E8]">Document Vault</CardTitle>
                <CardDescription className="text-[#888888]">
                  Download official fatwas and audit reports
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {documents.map((doc, index) => (
              <div
                key={doc.title}
                className="flex items-center justify-between p-4 rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] hover:border-[#D4AF37]/20 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-[#1A1A1A] flex items-center justify-center">
                    <FileText className="h-5 w-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-[#E8E8E8]">{doc.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-[#888888]">
                      <span>{doc.issuer}</span>
                      <span className="text-[#2A2A2A]">|</span>
                      <span>{doc.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-[#2A2A2A] text-[#888888] text-xs">
                    {doc.type}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#D4AF37] hover:bg-[#1A1A1A]"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Verification Banner */}
      <Card className="border-emerald-500/30 bg-emerald-500/5">
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-emerald-500/20">
                <Shield className="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <h3 className="font-medium text-[#E8E8E8] mb-1">
                  Cryptographically Verified Documents
                </h3>
                <p className="text-sm text-[#888888]">
                  All documents are hashed and stored on-chain for tamper-proof verification
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10 bg-transparent"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Verify on SidraChain
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
