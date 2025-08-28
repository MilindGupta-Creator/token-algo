"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, RefreshCw, Plus, Star } from "lucide-react"

const portfolioData = [
  {
    name: "Ethereum",
    symbol: "ETH",
    price: "$43,250.67",
    change: "+2.30%",
    changePositive: true,
    holdings: "0.0500",
    value: "$2,162.53",
    sparkline: "up",
    icon: "🔷",
  },
  {
    name: "Bitcoin",
    symbol: "BTC",
    price: "$2,654.32",
    change: "-1.20%",
    changePositive: false,
    holdings: "2.5000",
    value: "$6,635.80",
    sparkline: "down",
    icon: "🟠",
  },
  {
    name: "Solana",
    symbol: "SOL",
    price: "$98.45",
    change: "+4.70%",
    changePositive: true,
    holdings: "2.5000",
    value: "$1,476.75",
    sparkline: "up",
    icon: "🟣",
  },
  {
    name: "Dogecoin",
    symbol: "DOGE",
    price: "$43,250.67",
    change: "+2.30%",
    changePositive: true,
    holdings: "0.0500",
    value: "$2,162.53",
    sparkline: "up",
    icon: "🐕",
  },
  {
    name: "USDC",
    symbol: "USDC",
    price: "$2,654.32",
    change: "-1.20%",
    changePositive: false,
    holdings: "2.5000",
    value: "$6,635.80",
    sparkline: "down",
    icon: "🔵",
  },
  {
    name: "Stellar",
    symbol: "XLM",
    price: "$98.45",
    change: "+4.70%",
    changePositive: true,
    holdings: "15.0000",
    value: "$1,476.75",
    sparkline: "up",
    icon: "⭐",
  },
]

const chartData = [
  { name: "Bitcoin (BTC)", percentage: 21.0, color: "#fb923c" },
  { name: "Ethereum (ETH)", percentage: 64.6, color: "#a78bfa" },
  { name: "Solana (SOL)", percentage: 14.4, color: "#18c9dd" },
  { name: "Dogecoin (DOGE)", percentage: 14.4, color: "#32ca5b" },
  { name: "Solana (SOL)", percentage: 14.4, color: "#fb923c" },
  { name: "Solana (SOL)", percentage: 14.4, color: "#fb7185" },
]

function Sparkline({ trend }: { trend: string }) {
  const isUp = trend === "up"
  const color = isUp ? "#32ca5b" : "#fb7185"

  return (
    <div className="w-16 h-8 flex items-center">
      <svg width="64" height="32" viewBox="0 0 64 32">
        <path
          d={isUp ? "M2,28 Q16,20 32,16 Q48,12 62,4" : "M2,4 Q16,12 32,16 Q48,20 62,28"}
          stroke={color}
          strokeWidth="2"
          fill="none"
          className="opacity-80"
        />
      </svg>
    </div>
  )
}

function DonutChart() {
  const total = chartData.reduce((sum, item) => sum + item.percentage, 0)
  let cumulativePercentage = 0

  const radius = 80
  const strokeWidth = 24
  const normalizedRadius = radius - strokeWidth * 0.5
  const circumference = normalizedRadius * 2 * Math.PI

  return (
    <div className="relative w-48 h-48">
      <svg width="192" height="192" className="transform -rotate-90">
        <circle cx="96" cy="96" r={normalizedRadius} stroke="#27272a" strokeWidth={strokeWidth} fill="transparent" />
        {chartData.map((item, index) => {
          const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`
          const strokeDashoffset = (-cumulativePercentage * circumference) / 100
          cumulativePercentage += item.percentage

          return (
            <circle
              key={index}
              cx="96"
              cy="96"
              r={normalizedRadius}
              stroke={item.color}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-300"
            />
          )
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-20 h-20 bg-[#27272a] rounded-full"></div>
      </div>
    </div>
  )
}

export default function TokenPortfolio() {
  return (
    <div className="min-h-screen bg-[#212124] text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-6 border-b border-[#27272a]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#a9e851] rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-[#212124] rounded-sm"></div>
          </div>
          <h1 className="text-xl font-semibold">Token Portfolio</h1>
        </div>
        <Button className="bg-[#a9e851] text-[#212124] hover:bg-[#a9e851]/90 font-medium">💳 Connect Wallet</Button>
      </header>

      <div className="p-6">
        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Portfolio Total */}
          <div>
            <h2 className="text-[#a1a1aa] text-sm mb-4">Portfolio Total</h2>
            <div className="text-5xl font-bold mb-2">$10,275.08</div>
            <p className="text-[#71717a] text-sm">Last updated: 3:42:12 PM</p>
          </div>

          {/* Portfolio Chart */}
          <div>
            <h2 className="text-[#a1a1aa] text-sm mb-4">Portfolio Total</h2>
            <div className="flex items-center gap-8">
              <DonutChart />
              <div className="space-y-3">
                {chartData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between gap-8">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm text-[#a1a1aa]">{item.name}</span>
                    </div>
                    <span className="text-sm text-[#a1a1aa]">{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Watchlist */}
        <Card className="bg-[#18181b] border-[#27272a]">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-[#a9e851]" fill="currentColor" />
                <h2 className="text-xl font-semibold">Watchlist</h2>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#27272a] text-[#a1a1aa] hover:bg-[#27272a] bg-transparent"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Prices
                </Button>
                <Button size="sm" className="bg-[#a9e851] text-[#212124] hover:bg-[#a9e851]/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Token
                </Button>
              </div>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-7 gap-4 pb-3 border-b border-[#27272a] text-[#71717a] text-sm">
              <div>Token</div>
              <div>Price</div>
              <div>24h %</div>
              <div>Sparkline (7d)</div>
              <div>Holdings</div>
              <div>Value</div>
              <div></div>
            </div>

            {/* Table Rows */}
            <div className="space-y-0">
              {portfolioData.map((token, index) => (
                <div
                  key={index}
                  className="grid grid-cols-7 gap-4 py-4 border-b border-[#27272a]/50 hover:bg-[#27272a]/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm">
                      {token.icon}
                    </div>
                    <div>
                      <div className="font-medium">{token.name}</div>
                      <div className="text-[#71717a] text-sm">({token.symbol})</div>
                    </div>
                  </div>
                  <div className="flex items-center font-medium">{token.price}</div>
                  <div className="flex items-center">
                    <Badge
                      variant="secondary"
                      className={`${
                        token.changePositive
                          ? "bg-[#32ca5b]/20 text-[#32ca5b] border-[#32ca5b]/30"
                          : "bg-[#fb7185]/20 text-[#fb7185] border-[#fb7185]/30"
                      }`}
                    >
                      {token.change}
                    </Badge>
                  </div>
                  <div className="flex items-center">
                    <Sparkline trend={token.sparkline} />
                  </div>
                  <div className="flex items-center font-medium">{token.holdings}</div>
                  <div className="flex items-center font-medium">{token.value}</div>
                  <div className="flex items-center justify-end">
                    <Button variant="ghost" size="sm" className="text-[#71717a] hover:text-white">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between pt-4 text-sm text-[#71717a]">
              <div>1 — 10 of 100 results</div>
              <div className="flex items-center gap-4">
                <span>1 of 10 pages</span>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" disabled className="text-[#71717a]">
                    Prev
                  </Button>
                  <Button variant="ghost" size="sm" className="text-[#71717a] hover:text-white">
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
