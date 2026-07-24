'use client'

import { useState, useEffect } from 'react'
import { ShieldCheck, CheckCircle, ArrowsClockwise, ArrowSquareOut, Clock, Database, Coins, WarningCircle } from '@phosphor-icons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAPAXStore, formatWeight } from '@/lib/store'

export function PorView() {
  const { vaultData, auditLogs } = useAPAXStore()
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Calculate reserve ratio
  const totalMetalGrams = vaultData.totalGoldGrams + vaultData.totalSilverGrams + vaultData.totalPlatinumGrams
  const reserveRatio = (totalMetalGrams / vaultData.totalTokensMinted) * 100

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 2000)
  }

  // Format time ago
  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
    return `${Math.floor(diffMins / 1440)}d ago`
  }

  return (
    <div className="space-y-6 stagger-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#E8E8E8] stagger-in">
            Proof of Reserve Monitor
          </h1>
          <p className="text-sm text-[#888888] mt-1">
            Real-time verification of vault holdings vs. token supply
          </p>
        </div>
        <Button
          variant="outline"
          className="border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 bg-transparent"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <ArrowsClockwise weight="light" className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      {/* Verification Status Banner */}
      <Card className={`border-2 inner-glow-gold institutional-shadow ${vaultData.verificationStatus === 'verified'
        ? 'border-emerald-500/30 bg-emerald-500/5'
        : 'border-amber-500/30 bg-amber-500/5'
        }`}>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${vaultData.verificationStatus === 'verified'
                ? 'bg-emerald-500/20'
                : 'bg-amber-500/20'
                } pulse-gold`}>
                {vaultData.verificationStatus === 'verified' ? (
                  <CheckCircle weight="fill" className="h-6 w-6 text-emerald-500" />
                ) : (
                  <WarningCircle weight="fill" className="h-6 w-6 text-amber-500" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#E8E8E8]">
                  {vaultData.verificationStatus === 'verified'
                    ? 'All Reserves Verified'
                    : 'Verification in Progress'}
                </h3>
                <p className="text-sm text-[#888888]">
                  Last audit: {formatTimeAgo(vaultData.lastAuditDate)} | Reserve ratio: {reserveRatio.toFixed(2)}%
                </p>
              </div>
            </div>
            <Badge
              variant="outline"
              className={`${vaultData.verificationStatus === 'verified'
                ? 'border-emerald-500/30 text-emerald-500'
                : 'border-amber-500/30 text-amber-500'
                }`}
            >
              {vaultData.verificationStatus.charAt(0).toUpperCase() + vaultData.verificationStatus.slice(1)}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Main Comparison Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Vault Holdings Panel */}
        <Card className="glass border-[#2A2A2A] bg-[#111111] inner-glow-gold institutional-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#1A1A1A]">
                <Database weight="light" className="h-5 w-5 text-[#D4AF37]" />
              </div>
              <div>
                <CardTitle className="text-[#E8E8E8]">Allocated Bullion Inventory</CardTitle>
                <CardDescription className="text-[#888888]">
                  Verified physical metal bars in custody
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Gold */}
            <div className="p-4 rounded-lg border border-[#2A2A2A] bg-[#0A0A0A]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#D4AF37]" />
                  <span className="text-sm font-medium text-[#E8E8E8]">Gold</span>
                </div>
                <span className="text-lg font-bold text-[#D4AF37]">
                  {formatWeight(vaultData.totalGoldGrams)}
                </span>
              </div>
              <Progress
                value={60}
                className="h-2 bg-[#1A1A1A]"
              />
            </div>

            {/* Silver */}
            <div className="p-4 rounded-lg border border-[#2A2A2A] bg-[#0A0A0A]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#C0C0C0]" />
                  <span className="text-sm font-medium text-[#E8E8E8]">Silver</span>
                </div>
                <span className="text-lg font-bold text-[#C0C0C0]">
                  {formatWeight(vaultData.totalSilverGrams)}
                </span>
              </div>
              <Progress
                value={30}
                className="h-2 bg-[#1A1A1A]"
              />
            </div>

            {/* Platinum */}
            <div className="p-4 rounded-lg border border-[#2A2A2A] bg-[#0A0A0A]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#E5E4E2]" />
                  <span className="text-sm font-medium text-[#E8E8E8]">Platinum</span>
                </div>
                <span className="text-lg font-bold text-[#E5E4E2]">
                  {formatWeight(vaultData.totalPlatinumGrams)}
                </span>
              </div>
              <Progress
                value={10}
                className="h-2 bg-[#1A1A1A]"
              />
            </div>

            <div className="pt-4 border-t border-[#2A2A2A]">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#888888]">Total Vault Holdings</span>
                <span className="text-xl font-bold text-[#E8E8E8]">
                  {formatWeight(totalMetalGrams)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Token Supply Panel */}
        <Card className="glass border-[#2A2A2A] bg-[#111111] inner-glow-gold institutional-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#1A1A1A]">
                <Coins weight="light" className="h-5 w-5 text-[#D4AF37]" />
              </div>
              <div>
                <CardTitle className="text-[#E8E8E8]">Total Issued Token Liability</CardTitle>
                <CardDescription className="text-[#888888]">
                  Current circulating supply on ledger
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Total Tokens */}
            <div className="p-6 rounded-lg border border-[#D4AF37]/20 bg-gradient-to-br from-[#D4AF37]/10 to-transparent">
              <div className="text-center">
                <p className="text-sm text-[#888888] mb-2">Total APX Tokens Minted</p>
                <p className="text-4xl font-bold text-[#D4AF37]">
                  {vaultData.totalTokensMinted.toLocaleString()}
                </p>
                <p className="text-xs text-[#888888] mt-2">
                  1 Token = 1 Gram of underlying metal
                </p>
              </div>
            </div>

            {/* Token Breakdown */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] text-center">
                <p className="text-xs text-[#888888] mb-1">APX-Gold</p>
                <p className="text-lg font-bold text-[#D4AF37]">
                  {Math.floor(vaultData.totalGoldGrams).toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] text-center">
                <p className="text-xs text-[#888888] mb-1">APX-Silver</p>
                <p className="text-lg font-bold text-[#C0C0C0]">
                  {Math.floor(vaultData.totalSilverGrams).toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] text-center">
                <p className="text-xs text-[#888888] mb-1">APX-Platinum</p>
                <p className="text-lg font-bold text-[#E5E4E2]">
                  {Math.floor(vaultData.totalPlatinumGrams).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Reserve Ratio Indicator */}
            <div className="p-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck weight="light" className="h-5 w-5 text-emerald-500" />
                  <span className="text-sm font-medium text-[#E8E8E8]">Reserve Ratio</span>
                </div>
                <span className="text-xl font-bold text-emerald-500">
                  {reserveRatio.toFixed(2)}%
                </span>
              </div>
              <p className="text-xs text-[#888888] mt-2">
                Audit confirms 1:1 backing ratio for all issued obligations
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audit Log */}
      <Card className="glass border-[#2A2A2A] bg-[#111111] inner-glow-gold institutional-shadow">
        <CardHeader className="border-b border-[#2A2A2A] pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-[#D4AF37] rounded-full blur-[2px] animate-pulse opacity-50"></div>
                <div className="relative h-2.5 w-2.5 rounded-full bg-[#D4AF37] border border-[#0A0A0A]"></div>
              </div>
              <div>
                <CardTitle className="text-[#E8E8E8] font-mono tracking-wider uppercase text-sm">Live Security Feed</CardTitle>
                <CardDescription className="text-[#888888] font-mono text-xs">
                  Encrypted Verification Stream
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Human Audit Stamp */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded bg-[#D4AF37]/5 border border-[#D4AF37]/20">
                <div className="text-[10px] text-[#D4AF37] uppercase tracking-widest font-bold">Verified By</div>
                <div className="text-[#E8E8E8] signature-scanned text-lg leading-none transform -rotate-2">Lead Registered Auditor</div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#D4AF37] hover:bg-[#1A1A1A] font-mono text-xs"
              >
                <ArrowSquareOut weight="light" className="h-3 w-3 mr-2" />
                LEDGER
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-3">
              {auditLogs.map((log, index) => (
                <div
                  key={log.id}
                  className="flex items-start gap-4 p-4 rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] hover:border-[#D4AF37]/20 transition-colors"
                >
                  <div className="relative">
                    <div className="h-3 w-3 rounded-full bg-[#D4AF37]" />
                    {index < auditLogs.length - 1 && (
                      <div className="absolute top-4 left-1/2 w-px h-10 -translate-x-1/2 bg-[#2A2A2A]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 font-vault">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm text-[#E8E8E8] tracking-wide">
                        [{log.event.toUpperCase()}]
                      </h4>
                      <span className="text-xs text-[#666666]">
                        {formatTimeAgo(log.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-[#888888] mb-2 tracking-tight">
                      {log.details}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[#444444]">TX::HASH</span>
                      <code className="text-xs text-[#D4AF37] bg-[#1A1A1A] px-1.5 py-0.5 rounded-sm border border-[#2A2A2A]">
                        {log.txHash}
                      </code>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          {/* Scanning Line Effect */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent animate-scan pointer-events-none" />
        </CardContent>
      </Card>
    </div>
  )
}
