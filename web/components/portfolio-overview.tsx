'use client'

import { TrendUp, TrendDown, Wallet, Coins } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAPAXStore, formatCurrency, formatWeight } from '@/lib/store'

export function PortfolioOverview() {
  const { userHoldings, metalPrices } = useAPAXStore()

  // Calculate total portfolio value
  const goldValue = userHoldings.goldGrams * (metalPrices.gold / 31.1035)
  const silverValue = userHoldings.silverGrams * (metalPrices.silver / 31.1035)
  const platinumValue = userHoldings.platinumGrams * (metalPrices.platinum / 31.1035)
  const totalValue = goldValue + silverValue + platinumValue

  // Mock change data
  const dailyChange = 2.34
  const dailyChangePercent = 0.89

  const stats = [
    {
      title: 'Total Portfolio Value',
      value: formatCurrency(totalValue),
      change: dailyChange,
      changePercent: dailyChangePercent,
      icon: Wallet,
      gradient: 'from-[#D4AF37] to-[#B8860B]'
    },
    {
      title: 'Gold Holdings',
      value: formatWeight(userHoldings.goldGrams),
      subValue: formatCurrency(goldValue),
      icon: Coins,
      color: '#D4AF37'
    },
    {
      title: 'Silver Holdings',
      value: formatWeight(userHoldings.silverGrams),
      subValue: formatCurrency(silverValue),
      icon: Coins,
      color: '#C0C0C0'
    },
    {
      title: 'Platinum Holdings',
      value: formatWeight(userHoldings.platinumGrams),
      subValue: formatCurrency(platinumValue),
      icon: Coins,
      color: '#E5E4E2'
    }
  ]

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {/* Primary Card - Spans 2 cols for visibility */}
      <Card className="sm:col-span-2 glass-heavy border-[#D4AF37]/30 bg-[#111111] hover:border-[#D4AF37]/50 transition-vault relative overflow-hidden group inner-glow-gold institutional-shadow min-w-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-xs md:text-sm font-medium text-[#888888] font-serif">
            Total Portfolio Value
          </CardTitle>
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#B8860B] gold-glow-intense">
            <Wallet className="h-3.5 w-3.5 text-[#0A0A0A]" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-2xl md:text-4xl font-bold text-[#E8E8E8] tracking-tight font-vault">{formatCurrency(totalValue)}</div>
          <div className="flex items-center gap-2 mt-1.5">
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${dailyChange >= 0 ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
              {dailyChange >= 0 ? (
                <TrendUp className="h-3 w-3 text-emerald-500" />
              ) : (
                <TrendDown className="h-3 w-3 text-red-500" />
              )}
              <span className={`text-[10px] md:text-xs font-semibold font-vault ${dailyChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                {dailyChange >= 0 ? '+' : ''}{formatCurrency(dailyChange)} ({dailyChangePercent}%)
              </span>
            </div>
            <span className="text-[10px] md:text-xs text-[#888888]">past 24h</span>
          </div>
        </CardContent>
      </Card>

      {/* Metal Tokens - Fluid grid placement */}
      <Card className="glass border-[#2A2A2A] bg-[#111111] hover:border-[#D4AF37]/30 transition-vault min-w-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5">
          <CardTitle className="text-xs md:text-sm font-medium text-[#888888]">Gold Holdings</CardTitle>
          <div className="p-1.5 rounded-lg bg-[#1A1A1A]">
            <Coins className="h-3.5 w-3.5 text-[#D4AF37]" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xl md:text-2xl font-bold text-[#E8E8E8] font-vault">{formatWeight(userHoldings.goldGrams)}</div>
          <p className="text-[10px] md:text-xs text-[#888888] mt-0.5 font-vault">{formatCurrency(goldValue)}</p>
        </CardContent>
      </Card>

      <Card className="glass border-[#2A2A2A] bg-[#111111] hover:border-[#C0C0C0]/30 transition-vault min-w-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5">
          <CardTitle className="text-xs md:text-sm font-medium text-[#888888]">Silver Holdings</CardTitle>
          <div className="p-1.5 rounded-lg bg-[#1A1A1A]">
            <Coins className="h-3.5 w-3.5 text-[#C0C0C0]" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xl md:text-2xl font-bold text-[#E8E8E8] font-vault">{formatWeight(userHoldings.silverGrams)}</div>
          <p className="text-[10px] md:text-xs text-[#888888] mt-0.5 font-vault">{formatCurrency(silverValue)}</p>
        </CardContent>
      </Card>

      <Card className="glass border-[#2A2A2A] bg-[#111111] hover:border-[#E5E4E2]/30 transition-vault min-w-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5">
          <CardTitle className="text-xs md:text-sm font-medium text-[#888888]">Platinum Holdings</CardTitle>
          <div className="p-1.5 rounded-lg bg-[#1A1A1A]">
            <Coins className="h-3.5 w-3.5 text-[#E5E4E2]" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xl md:text-2xl font-bold text-[#E8E8E8] font-vault">{formatWeight(userHoldings.platinumGrams)}</div>
          <p className="text-[10px] md:text-xs text-[#888888] mt-0.5 font-vault">{formatCurrency(platinumValue)}</p>
        </CardContent>
      </Card>
    </div>
  )
}
