'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAPAXStore, formatCurrency } from '@/lib/store'

const COLORS = {
  gold: '#D4AF37',
  silver: '#C0C0C0',
  platinum: '#E5E4E2'
}

export function AssetAllocationChart() {
  const { userHoldings, metalPrices } = useAPAXStore()

  // Calculate values
  const goldValue = userHoldings.goldGrams * (metalPrices.gold / 31.1035)
  const silverValue = userHoldings.silverGrams * (metalPrices.silver / 31.1035)
  const platinumValue = userHoldings.platinumGrams * (metalPrices.platinum / 31.1035)
  const totalValue = goldValue + silverValue + platinumValue

  const data = [
    {
      name: 'Gold',
      value: goldValue,
      percentage: ((goldValue / totalValue) * 100).toFixed(1),
      grams: userHoldings.goldGrams,
      color: COLORS.gold
    },
    {
      name: 'Silver',
      value: silverValue,
      percentage: ((silverValue / totalValue) * 100).toFixed(1),
      grams: userHoldings.silverGrams,
      color: COLORS.silver
    },
    {
      name: 'Platinum',
      value: platinumValue,
      percentage: ((platinumValue / totalValue) * 100).toFixed(1),
      grams: userHoldings.platinumGrams,
      color: COLORS.platinum
    }
  ]

  // APX-i breakdown (60% Gold, 30% Silver, 10% Platinum)
  const apxiData = [
    { name: 'Gold', value: 60, color: COLORS.gold },
    { name: 'Silver', value: 30, color: COLORS.silver },
    { name: 'Platinum', value: 10, color: COLORS.platinum }
  ]

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: typeof data[0] }> }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload
      return (
        <div className="glass rounded-lg p-3 border border-[#2A2A2A]">
          <p className="text-sm font-medium text-[#E8E8E8]" style={{ color: item.color }}>
            {item.name}
          </p>
          <p className="text-xs text-[#888888]">{formatCurrency(item.value)}</p>
          <p className="text-xs text-[#888888]">{item.grams?.toFixed(2)}g</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Your Holdings Chart */}
      <Card className="glass border-[#2A2A2A] bg-[#111111] overflow-hidden">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-base md:text-lg text-[#E8E8E8] font-serif">Your Asset Allocation</CardTitle>
          <CardDescription className="text-xs text-[#888888]">
            Distribution of holdings
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 py-8 flex flex-col items-center justify-center gap-6">
          <div className="relative h-[180px] w-full max-w-[200px] md:h-[200px] md:max-w-[220px] shrink-0">
            {/* Ambient Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 via-transparent to-transparent blur-[30px] rounded-full" />

            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                  animationBegin={0}
                  animationDuration={1500}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      className="transition-all duration-300 hover:opacity-80"
                      style={{ filter: `drop-shadow(0 0 8px ${entry.color}44)` }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="w-full max-w-sm">
            <div className="grid grid-cols-3 gap-2">
              {data.map((item) => (
                <div key={item.name} className="flex flex-col items-center text-center gap-1">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-1.5 w-1.5 rounded-full shrink-0 shadow-[0_0_8px_rgba(255,255,255,0.1)]"
                      style={{ backgroundColor: item.color }}
                    />
                    <p className="text-[9px] font-bold text-[#888888] uppercase tracking-[0.1em]">{item.name}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="text-xs font-bold text-[#E8E8E8] font-vault leading-none">{item.percentage}%</p>
                    <p className="text-[9px] text-[#555555] font-vault mt-1">{item.grams.toFixed(1)}g</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="h-px w-full bg-gradient-to-r from-transparent via-[#2A2A2A] to-transparent mt-4" />
          </div>
        </CardContent>
      </Card>

      {/* APX-i Index Token Breakdown */}
      <Card className="glass border-[#2A2A2A] bg-[#111111] overflow-hidden">
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center gold-glow shrink-0">
              <span className="text-[#0A0A0A] font-bold text-[10px]">APX-i</span>
            </div>
            <div className="min-w-0">
              <CardTitle className="text-base md:text-lg text-[#E8E8E8] font-serif truncate">APX-i Index Token</CardTitle>
              <CardDescription className="text-xs text-[#888888] truncate">
                Diversified index
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 py-8 flex flex-col items-center justify-center gap-6">
          <div className="relative h-[180px] w-full max-w-[200px] md:h-[200px] md:max-w-[220px] shrink-0">
            {/* Ambient Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 via-transparent to-transparent blur-[30px] rounded-full" />

            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={apxiData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                  animationBegin={0}
                  animationDuration={1500}
                >
                  {apxiData.map((entry, index) => (
                    <Cell
                      key={`cell-apxi-${index}`}
                      fill={entry.color}
                      className="transition-all duration-300 hover:opacity-80"
                      style={{ filter: `drop-shadow(0 0 8px ${entry.color}33)` }}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="w-full max-w-sm">
            <div className="grid grid-cols-3 gap-2 mb-6">
              {apxiData.map((item) => (
                <div key={item.name} className="flex flex-col items-center text-center gap-1">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-1.5 w-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <p className="text-[9px] font-bold text-[#888888] uppercase tracking-[0.1em]">{item.name}</p>
                  </div>
                  <p className="text-xs font-bold text-[#E8E8E8] font-vault leading-none">{item.value}%</p>
                </div>
              ))}
            </div>

            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-[#D4AF37]/5 to-[#B8860B]/5 rounded-xl blur-md transition-all duration-500 group-hover:from-[#D4AF37]/10 group-hover:to-[#B8860B]/10" />
              <div className="relative flex items-center justify-between bg-[#0A0A0A]/60 backdrop-blur-md rounded-lg p-2.5 border border-[#2A2A2A] shadow-inner">
                <p className="text-[9px] text-[#555555] font-bold uppercase tracking-[0.15em]">Holdings</p>
                <div className="flex items-baseline gap-1.5">
                  <p className="text-lg font-bold text-[#D4AF37] font-vault tracking-tight">
                    {useAPAXStore.getState().userHoldings.apxiTokens.toLocaleString()}
                  </p>
                  <span className="text-[9px] text-[#888888] font-bold uppercase font-vault tracking-widest">APX-i</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
