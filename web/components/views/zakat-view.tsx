'use client'

import { useState, useEffect } from 'react'
import { Calculator, Info, CheckCircle, Coins, TrendUp, Heart } from '@phosphor-icons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useAPAXStore, formatCurrency } from '@/lib/store'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

export function ZakatView() {
  const { userHoldings, metalPrices, zakatCalculation, calculateZakat } = useAPAXStore()
  const [additionalCash, setAdditionalCash] = useState(0)
  const [hasCalculated, setHasCalculated] = useState(false)

  // Calculate asset values
  const goldValue = userHoldings.goldGrams * (metalPrices.gold / 31.1035)
  const silverValue = userHoldings.silverGrams * (metalPrices.silver / 31.1035)
  const platinumValue = userHoldings.platinumGrams * (metalPrices.platinum / 31.1035)
  const totalApaxValue = goldValue + silverValue + platinumValue
  const totalAssets = totalApaxValue + additionalCash

  // Nisab calculation (85g gold or 595g silver - use lower value)
  const nisabGold = 85 * (metalPrices.gold / 31.1035)
  const nisabSilver = 595 * (metalPrices.silver / 31.1035)
  const nisabThreshold = Math.min(nisabGold, nisabSilver)

  const isAboveNisab = totalAssets >= nisabThreshold
  const zakatDue = isAboveNisab ? totalAssets * 0.025 : 0

  const handleCalculate = () => {
    calculateZakat()
    setHasCalculated(true)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#E8E8E8]">
            Zakat Calculator
          </h1>
          <p className="text-sm text-[#888888] mt-1">
            Calculate your annual Zakat obligation on precious metal holdings
          </p>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="border-[#2A2A2A] text-[#888888] hover:text-[#E8E8E8] hover:bg-[#1A1A1A] bg-transparent"
              >
                <Info weight="light" className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs bg-[#1A1A1A] border-[#2A2A2A] text-[#E8E8E8]">
              <p className="text-sm">
                Zakat is 2.5% of wealth above the Nisab threshold, held for one lunar year.
                The Nisab is equivalent to 85g of gold or 595g of silver.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Asset Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* APAX Holdings Card */}
          <Card className="glass border-[#2A2A2A] bg-[#111111]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#B8860B]">
                  <Coins weight="light" className="h-5 w-5 text-[#0A0A0A]" />
                </div>
                <div>
                  <CardTitle className="text-[#E8E8E8]">Your APAX Holdings</CardTitle>
                  <CardDescription className="text-[#888888]">
                    Real-time query of account inventory
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                {/* Gold */}
                <div className="p-4 rounded-lg border border-[#D4AF37]/20 bg-[#D4AF37]/5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-3 w-3 rounded-full bg-[#D4AF37]" />
                    <span className="text-sm font-medium text-[#E8E8E8]">Gold</span>
                  </div>
                  <p className="text-xl font-bold text-[#D4AF37]">
                    {userHoldings.goldGrams.toFixed(2)}g
                  </p>
                  <p className="text-xs text-[#888888] mt-1">
                    {formatCurrency(goldValue)}
                  </p>
                </div>

                {/* Silver */}
                <div className="p-4 rounded-lg border border-[#C0C0C0]/20 bg-[#C0C0C0]/5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-3 w-3 rounded-full bg-[#C0C0C0]" />
                    <span className="text-sm font-medium text-[#E8E8E8]">Silver</span>
                  </div>
                  <p className="text-xl font-bold text-[#C0C0C0]">
                    {userHoldings.silverGrams.toFixed(2)}g
                  </p>
                  <p className="text-xs text-[#888888] mt-1">
                    {formatCurrency(silverValue)}
                  </p>
                </div>

                {/* Platinum */}
                <div className="p-4 rounded-lg border border-[#E5E4E2]/20 bg-[#E5E4E2]/5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-3 w-3 rounded-full bg-[#E5E4E2]" />
                    <span className="text-sm font-medium text-[#E8E8E8]">Platinum</span>
                  </div>
                  <p className="text-xl font-bold text-[#E5E4E2]">
                    {userHoldings.platinumGrams.toFixed(2)}g
                  </p>
                  <p className="text-xs text-[#888888] mt-1">
                    {formatCurrency(platinumValue)}
                  </p>
                </div>
              </div>

              <Separator className="bg-[#2A2A2A]" />

              <div className="flex items-center justify-between">
                <span className="text-sm text-[#888888]">Total APAX Holdings Value</span>
                <span className="text-xl font-bold text-[#E8E8E8]">
                  {formatCurrency(totalApaxValue)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Additional Assets */}
          <Card className="glass border-[#2A2A2A] bg-[#111111]">
            <CardHeader>
              <CardTitle className="text-[#E8E8E8]">Additional Zakatable Assets</CardTitle>
              <CardDescription className="text-[#888888]">
                External Cash & Equivalents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cash" className="text-[#E8E8E8]">
                    Cash & Bank Savings (USD)
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]">$</span>
                    <Input
                      id="cash"
                      type="number"
                      placeholder="0.00"
                      value={additionalCash || ''}
                      onChange={(e) => setAdditionalCash(Number(e.target.value) || 0)}
                      className="pl-8 bg-[#0A0A0A] border-[#2A2A2A] text-[#E8E8E8] focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Zakat Summary Panel */}
        <div className="space-y-6">
          {/* Nisab Status */}
          <Card className={`border-2 ${isAboveNisab
            ? 'border-[#D4AF37]/30 bg-[#D4AF37]/5'
            : 'border-[#2A2A2A] bg-[#111111]'
            }`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-[#E8E8E8] text-lg">Nisab Threshold</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#888888]">Current Nisab</span>
                  <span className="font-medium text-[#E8E8E8]">
                    {formatCurrency(nisabThreshold)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#888888]">Your Total Assets</span>
                  <span className="font-medium text-[#E8E8E8]">
                    {formatCurrency(totalAssets)}
                  </span>
                </div>
                <Separator className="bg-[#2A2A2A]" />
                <div className="flex items-center gap-2">
                  {isAboveNisab ? (
                    <>
                      <CheckCircle weight="light" className="h-4 w-4 text-[#D4AF37]" />
                      <span className="text-sm text-[#D4AF37]">Above Nisab - Zakat is due</span>
                    </>
                  ) : (
                    <>
                      <Info weight="light" className="h-4 w-4 text-[#888888]" />
                      <span className="text-sm text-[#888888]">Below Nisab threshold</span>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Zakat Calculation */}
          <Card className="glass border-[#2A2A2A] bg-[#111111]">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Calculator weight="light" className="h-5 w-5 text-[#D4AF37]" />
                <CardTitle className="text-[#E8E8E8] text-lg">Zakat Due</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <p className="text-sm text-[#888888] mb-2">2.5% of Zakatable Assets</p>
                <p className={`text-4xl font-bold ${isAboveNisab ? 'text-[#D4AF37]' : 'text-[#888888]'}`}>
                  {formatCurrency(zakatDue)}
                </p>
                {isAboveNisab && (
                  <p className="text-xs text-[#888888] mt-2">
                    Based on current market prices
                  </p>
                )}
              </div>

              <Button
                className="w-full mt-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0A0A0A] hover:opacity-90"
                onClick={handleCalculate}
              >
                <Calculator weight="light" className="h-4 w-4 mr-2" />
                Recalculate Zakat
              </Button>
            </CardContent>
          </Card>

          {/* Niyyah Card */}
          {isAboveNisab && hasCalculated && (
            <Card className="border-emerald-500/30 bg-emerald-500/5">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <Heart weight="light" className="h-8 w-8 text-emerald-500 mx-auto" />
                  <div>
                    <h4 className="font-medium text-[#E8E8E8] mb-1">Make Your Intention</h4>
                    <p className="text-xs text-[#888888]">
                      &ldquo;I intend to give Zakat for the sake of Allah&rdquo;
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      // Toggle visual state (mock)
                      const doc = document.getElementById('niyyah-btn');
                      if (doc) {
                        doc.innerText = "Niyyah Confirmed";
                        doc.classList.add("bg-emerald-500/10");
                      }
                    }}
                    id="niyyah-btn"
                    className="w-full border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10 bg-transparent transition-all duration-500"
                  >
                    Confirm Niyyah (Intent)
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Live Prices Info */}
          <Card className="glass border-[#2A2A2A] bg-[#111111]">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-3">
                <TrendUp weight="light" className="h-4 w-4 text-[#D4AF37]" />
                <span className="text-sm font-medium text-[#E8E8E8]">Live Metal Prices</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#888888]">Gold (oz)</span>
                  <span className="text-[#D4AF37]">${metalPrices.gold.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888888]">Silver (oz)</span>
                  <span className="text-[#C0C0C0]">${metalPrices.silver.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888888]">Platinum (oz)</span>
                  <span className="text-[#E5E4E2]">${metalPrices.platinum.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
