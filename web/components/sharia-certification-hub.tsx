'use client'

import { FileText, Download, Shield, CheckCircle, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const certifications = [
  {
    id: 1,
    title: 'APAX Sharia Compliance Fatwa',
    issuer: 'International Sharia Advisory Board',
    date: 'January 2026',
    status: 'active',
    type: 'fatwa',
    description: 'Official Fatwa: Tokenization Structure & Custody Agreements'
  },
  {
    id: 2,
    title: 'Quarterly Audit Report Q4 2025',
    issuer: 'Al-Qalam Sharia Audit',
    date: 'December 2025',
    status: 'active',
    type: 'audit',
    description: 'Independent Assurance Report: Physical Vault Inspection'
  },
  {
    id: 3,
    title: 'SidraChain Halal Certification',
    issuer: 'Islamic Finance Council',
    date: 'October 2025',
    status: 'active',
    type: 'certification',
    description: 'Technical Compliance Certificate: Ledger Architecture'
  },
  {
    id: 4,
    title: 'Metal Sourcing Ethics Report',
    issuer: 'Ethical Metals Foundation',
    date: 'November 2025',
    status: 'active',
    type: 'report',
    description: 'Supply Chain Due Diligence: Responsible Sourcing'
  }
]

const typeIcons = {
  fatwa: '📜',
  audit: '📊',
  certification: '🏅',
  report: '📋'
}

export function ShariaCertificationHub() {
  return (
    <Card className="glass border-[#2A2A2A] bg-[#111111]">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#B8860B] shrink-0">
              <Shield className="h-4 w-4 text-[#0A0A0A]" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-base md:text-lg text-[#E8E8E8] font-serif truncate">Sharia Certification Hub</CardTitle>
              <CardDescription className="text-[11px] text-[#888888] truncate hidden sm:block">
                Verified compliance documents and audit reports
              </CardDescription>
            </div>
          </div>
          <Badge
            variant="outline"
            className="border-emerald-500/30 bg-emerald-500/10 text-emerald-500 text-[10px] h-6 px-2 shrink-0"
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            <span className="truncate">Compliant</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="group relative p-3 rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] hover:border-[#D4AF37]/30 transition-all duration-300"
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="text-xl shrink-0">{typeIcons[cert.type as keyof typeof typeIcons]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="text-[13px] font-medium text-[#E8E8E8] truncate">
                      {cert.title}
                    </h4>
                  </div>
                  <p className="text-[11px] text-[#888888] mb-1.5 line-clamp-2 leading-relaxed">
                    {cert.description}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-[#888888]">
                    <span className="truncate">{cert.issuer}</span>
                    <span className="text-[#2A2A2A] shrink-0">|</span>
                    <span className="shrink-0">{cert.date}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#2A2A2A]">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 h-7 text-[10px] text-[#C0C0C0] hover:text-[#D4AF37] hover:bg-[#1A1A1A] px-1"
                >
                  <Download className="h-3 w-3 mr-1 shrink-0" />
                  <span className="truncate">Download PDF</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 h-7 text-[10px] text-[#C0C0C0] hover:text-[#D4AF37] hover:bg-[#1A1A1A] px-1"
                >
                  <ExternalLink className="h-3 w-3 mr-1 shrink-0" />
                  <span className="truncate">View Online</span>
                </Button>
              </div>

              {/* Active indicator */}
              <div className="absolute top-3 right-3">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        {/* Verification Banner */}
        <div className="mt-3 p-3 rounded-lg bg-gradient-to-r from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/20">
          <div className="flex items-center gap-3 min-w-0">
            <FileText className="h-4 w-4 text-[#D4AF37] shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-medium text-[#E8E8E8] truncate leading-tight">
                Cryptographically signed and verified
              </p>
              <p className="text-[10px] text-[#888888] truncate leading-tight mt-0.5">
                Last verification: 2h ago | Next audit: Mar 2026
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-7 border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 bg-transparent text-[10px] px-3 shrink-0"
            >
              Verify
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
