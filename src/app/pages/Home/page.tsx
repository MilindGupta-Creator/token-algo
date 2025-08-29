"use client"

import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, RefreshCw, Plus, Star, Pencil, Trash, ChevronLeft, ChevronRight } from "lucide-react"

interface Token {
  name: string
  symbol: string
  price: string
  change: string
  changePositive: boolean
  holdings: string
  value: string
  sparkline: string
  icon: string
}

const portfolioData = [
  {
    name: "Bitcoin",
    symbol: "BTC",
    price: "$43,250.67",
    change: "+2.30%",
    changePositive: true,
    holdings: "0.1534",
    value: "$6,635.80",
    sparkline: "up",
    icon: "🟠",
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    price: "$2,654.32",
    change: "-1.20%",
    changePositive: false,
    holdings: "0.8150",
    value: "$2,162.53",
    sparkline: "down",
    icon: "🔷",
  },
  {
    name: "Solana",
    symbol: "SOL",
    price: "$98.45",
    change: "+4.70%",
    changePositive: true,
    holdings: "15.0000",
    value: "$1,476.75",
    sparkline: "up",
    icon: "🟣",
  },
  {
    name: "Dogecoin",
    symbol: "DOGE",
    price: "$0.0823",
    change: "+2.30%",
    changePositive: true,
    holdings: "26250.0000",
    value: "$2,162.53",
    sparkline: "up",
    icon: "🐕",
  },
  {
    name: "USDC",
    symbol: "USDC",
    price: "$1.00",
    change: "0.00%",
    changePositive: true,
    holdings: "535.0000",
    value: "$535.00",
    sparkline: "flat",
    icon: "🔵",
  },
  {
    name: "Stellar",
    symbol: "XLM",
    price: "$0.0985",
    change: "+4.70%",
    changePositive: true,
    holdings: "15000.0000",
    value: "$1,476.75",
    sparkline: "up",
    icon: "⭐",
  },
]

// Master list for the Add Token modal (can be expanded or fetched later)
const allTokens = [
  ...portfolioData,
  { name: "Hyperliquid", symbol: "HYPE", price: "$12.34", change: "+1.2%", changePositive: true, holdings: "0.0000", value: "$0.00", sparkline: "up", icon: "✨" },
  { name: "PinLink", symbol: "PIN", price: "$1.02", change: "-0.5%", changePositive: false, holdings: "0.0000", value: "$0.00", sparkline: "down", icon: "📌" },
  { name: "Stader", symbol: "SD", price: "$0.85", change: "+0.3%", changePositive: true, holdings: "0.0000", value: "$0.00", sparkline: "up", icon: "⭐" },
  { name: "Avalanche", symbol: "AVAX", price: "$34.22", change: "+2.1%", changePositive: true, holdings: "0.0000", value: "$0.00", sparkline: "up", icon: "🏔️" },
  { name: "Polygon", symbol: "MATIC", price: "$0.87", change: "-0.4%", changePositive: false, holdings: "0.0000", value: "$0.00", sparkline: "down", icon: "🟪" },
  { name: "Cardano", symbol: "ADA", price: "$0.52", change: "+0.8%", changePositive: true, holdings: "0.0000", value: "$0.00", sparkline: "up", icon: "🟦" },
  { name: "Ripple", symbol: "XRP", price: "$0.62", change: "-1.2%", changePositive: false, holdings: "0.0000", value: "$0.00", sparkline: "down", icon: "💧" },
  { name: "BNB", symbol: "BNB", price: "$398.10", change: "+0.5%", changePositive: true, holdings: "0.0000", value: "$0.00", sparkline: "up", icon: "🟡" },
  { name: "Polkadot", symbol: "DOT", price: "$6.22", change: "-0.6%", changePositive: false, holdings: "0.0000", value: "$0.00", sparkline: "down", icon: "🎯" },
  { name: "Chainlink", symbol: "LINK", price: "$17.44", change: "+1.9%", changePositive: true, holdings: "0.0000", value: "$0.00", sparkline: "up", icon: "🔗" },
  { name: "Arbitrum", symbol: "ARB", price: "$1.24", change: "+0.2%", changePositive: true, holdings: "0.0000", value: "$0.00", sparkline: "up", icon: "🌀" },
  { name: "Aptos", symbol: "APT", price: "$9.15", change: "-0.8%", changePositive: false, holdings: "0.0000", value: "$0.00", sparkline: "down", icon: "🅰️" },
  { name: "Optimism", symbol: "OP", price: "$2.34", change: "+0.7%", changePositive: true, holdings: "0.0000", value: "$0.00", sparkline: "up", icon: "🟥" },
  { name: "Sui", symbol: "SUI", price: "$1.12", change: "-0.3%", changePositive: false, holdings: "0.0000", value: "$0.00", sparkline: "down", icon: "💠" },
  { name: "Injective", symbol: "INJ", price: "$27.02", change: "+3.1%", changePositive: true, holdings: "0.0000", value: "$0.00", sparkline: "up", icon: "🧪" },
  { name: "NEAR", symbol: "NEAR", price: "$5.42", change: "+0.6%", changePositive: true, holdings: "0.0000", value: "$0.00", sparkline: "up", icon: "📍" },
  { name: "TRON", symbol: "TRX", price: "$0.12", change: "-0.2%", changePositive: false, holdings: "0.0000", value: "$0.00", sparkline: "down", icon: "🚀" },
  { name: "Litecoin", symbol: "LTC", price: "$82.40", change: "+0.1%", changePositive: true, holdings: "0.0000", value: "$0.00", sparkline: "up", icon: "💡" },
]

const chartData = [
  { name: "Bitcoin (BTC)", percentage: 32.5, color: "#f7931a" },
  { name: "Ethereum (ETH)", percentage: 28.3, color: "#627eea" },
  { name: "Solana (SOL)", percentage: 18.7, color: "#14f195" },
  { name: "Dogecoin (DOGE)", percentage: 12.1, color: "#c2a633" },
  { name: "USDC", percentage: 5.2, color: "#2775ca" },
  { name: "Stellar (XLM)", percentage: 3.2, color: "#000000" },
]

function Sparkline({ trend }: { trend: string }) {
  const isUp = trend === "up"
  const isFlat = trend === "flat"
  const color = isUp ? "#32ca5b" : isFlat ? "#71717a" : "#fb7185"

  const width = 64
  const height = 32
  const padding = 2
  const numPoints = 28

  // Generate lightweight pseudo-random sparkline data
  const points: Array<[number, number]> = []
  
  if (isFlat) {
    // Flat line with minimal variation
    const baseY = height / 2
    for (let i = 0; i < numPoints; i++) {
      const x = padding + (width - padding * 2) * (i / (numPoints - 1))
      const y = baseY + (Math.random() - 0.5) * 1
      points.push([x, y])
    }
  } else {
    // Trending line
    const start = isUp ? height - 8 : 8
    const end = isUp ? 8 : height - 8
    for (let i = 0; i < numPoints; i++) {
      const t = i / (numPoints - 1)
      const base = start + (end - start) * t
      const noise = Math.sin(i * 0.9) * 2 + (Math.random() - 0.5) * 2
      const y = Math.max(padding, Math.min(height - padding, base + noise))
      const x = padding + (width - padding * 2) * t
      points.push([x, y])
    }
  }

  const linePath = points
    .map((p, idx) => `${idx === 0 ? "M" : "L"}${p[0].toFixed(2)},${p[1].toFixed(2)}`)
    .join(" ")

  const areaPath = `${linePath} L${points[points.length - 1][0].toFixed(2)},${height - padding} L${points[0][0].toFixed(2)},${height - padding} Z`

  return (
    <div className="w-16 h-8 flex items-center">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <path d={areaPath} fill={isUp ? "#32ca5b22" : isFlat ? "#71717a22" : "#fb718522"} />
        <path d={linePath} stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  )
}

function DonutChart({ data }: { data: typeof portfolioData }) {
  let cumulativePercentage = 0

  const radius = 80
  const strokeWidth = 20
  const normalizedRadius = radius - strokeWidth * 0.5
  const circumference = normalizedRadius * 2 * Math.PI

  return (
    <div className="relative w-48 h-48">
      <svg width="192" height="192" className="transform -rotate-90">
        {/* Background circle */}
        <circle 
          cx="96" 
          cy="96" 
          r={normalizedRadius} 
          stroke="#27272a" 
          strokeWidth={strokeWidth} 
          fill="transparent" 
        />
        {/* Data segments */}
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
              className="transition-all duration-500 ease-out"
              strokeLinecap="round"
            />
          )
        })}
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-bold text-white">${data.reduce((sum: number, token: Token) => sum + parseFloat(token.value.replace('$', '').replace(',', '')), 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
        <div className="text-xs text-[#71717a]">Total Value</div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const [data, setData] = useState<Token[]>(portfolioData)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editValue, setEditValue] = useState<string>("")
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // Update timestamp every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  // Calculate pagination
  const totalPages = Math.ceil(data.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = data.slice(startIndex, endIndex)

  // Refresh prices functionality
  const refreshPrices = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Update prices with some random variation
    const updatedData = data.map(token => {
      const priceChange = (Math.random() - 0.5) * 0.1 // ±5% change
      const currentPrice = parseFloat(token.price.replace('$', '').replace(',', ''))
      const newPrice = currentPrice * (1 + priceChange)
      const changePercent = priceChange * 100
      
      return {
        ...token,
        price: `$${newPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        change: `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`,
        changePositive: changePercent >= 0,
        sparkline: changePercent >= 0 ? 'up' : 'down',
        value: `$${(newPrice * parseFloat(token.holdings)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      }
    })
    
    setData(updatedData)
    setLastUpdated(new Date())
    setIsRefreshing(false)
  }

  const startEdit = (index: number) => {
    setEditingIndex(index)
    setEditValue(String(data[index].holdings))
  }

  const saveEdit = (index: number) => {
    const next = [...data]
    const numeric = Number(editValue)
    next[index] = { ...next[index], holdings: isNaN(numeric) ? editValue : numeric.toFixed(4) }
    setData(next)
    setEditingIndex(null)
  }

  const removeToken = (index: number) => {
    const next = data.filter((_, i) => i !== index)
    setData(next)
    setOpenMenuIndex(null)
    if (editingIndex === index) setEditingIndex(null)
  }

  const toggleSelect = (symbol: string) => {
    setSelected((prev) => ({ ...prev, [symbol]: !prev[symbol] }))
  }

  const addSelectedTokens = () => {
    const currentSymbols = new Set(data.map((t) => t.symbol))
    const toAdd = allTokens.filter((t) => selected[t.symbol] && !currentSymbols.has(t.symbol))
    if (toAdd.length) {
      setData([...data, ...toAdd])
    }
    setSelected({})
    setSearch("")
    setIsAddOpen(false)
  }

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
            <div className="text-5xl font-bold mb-2">
              ${data.reduce((sum, token) => sum + parseFloat(token.value.replace('$', '').replace(',', '')), 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-[#71717a] text-sm">
              Last updated: {lastUpdated.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true })}
            </p>
          </div>

          {/* Portfolio Chart */}
          <div>
            <h2 className="text-[#a1a1aa] text-sm mb-4">Portfolio Distribution</h2>
            <div className="flex items-center gap-8 sm:flex-col lg:flex-row">
              <DonutChart data={data} />
              <div className="space-y-3">
                {chartData.slice(0, 5).map((item, index) => (
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
                <h2 className="text-xl text-white font-semibold">Watchlist</h2>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#27272a] text-[#a1a1aa] bg-transparent hover:bg-[#27272a]/50"
                  onClick={refreshPrices}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span className="hidden md:inline">{isRefreshing ? 'Refreshing...' : 'Refresh Prices'}</span>
                </Button>
                <Button size="sm" className="bg-[#a9e851] text-[#212124] hover:bg-[#a9e851]/90" onClick={() => setIsAddOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Token
                </Button>
              </div>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-3 md:grid-cols-7 gap-16 md:gap-8 pb-3 border-b border-[#27272a] text-[#71717a] text-sm">
              <div>Token</div>
              <div>Price</div>
              <div className="hidden md:block">24h %</div>
              <div className="hidden md:block">Sparkline (7d)</div>
              <div className="hidden md:block">Holdings</div>
              <div className="hidden md:block">Value</div>
              <div></div>
            </div>

            {/* Table Rows */}
            <div className="space-y-0">
              {currentData.map((token, index) => {
                const actualIndex = startIndex + index
                return (
                  <div
                    key={actualIndex}
                    className="grid grid-cols-3 md:grid-cols-7 gap-16 md:gap-12 py-4 border-b border-[#27272a]/50 hover:bg-[#27272a]/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm">
                        {token.icon}
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <div className="font-medium text-white">{token.name}</div>
                        <div className="text-[#71717a] text-sm">({token.symbol})</div>
                      </div>
                    </div>
                    <div className="flex items-center font-medium text-white">{token.price}</div>
                    <div className="hidden md:flex items-center">
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
                    <div className="hidden md:flex items-center">
                      <Sparkline trend={token.sparkline} />
                    </div>
                    <div className="hidden md:block">
                      {editingIndex === actualIndex ? (
                        <div className="flex items-center gap-3">
                          <input
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-28 bg-transparent border border-[#3a3a3f] focus:ring-2 focus:ring-[#a9e851] focus:border-[#a9e851] rounded-md px-3 py-1 text-white placeholder:text-[#71717a]"
                            placeholder="Select"
                            step="0.0001"
                          />
                          <Button
                            size="sm"
                            className="bg-[#a9e851] text-[#212124] hover:bg-[#a9e851]/90"
                            onClick={() => saveEdit(actualIndex)}
                          >
                            Save
                          </Button>
                        </div>
                      ) : (
                        <div
                          className="flex items-center font-medium text-white cursor-pointer hover:text-[#a9e851] transition-colors"
                          onClick={() => startEdit(actualIndex)}
                        >
                          {token.holdings}
                        </div>
                      )}
                    </div>
                    <div className="hidden md:flex items-center font-medium text-white ml-4">{token.value}</div>
                    <div className="flex items-center justify-end relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#a1a1aa] hover:text-[#e4e4e7]"
                        onClick={() => setOpenMenuIndex(openMenuIndex === actualIndex ? null : actualIndex)}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                      {openMenuIndex === actualIndex && (
                        <div className="absolute right-0 top-8 z-10 w-40 rounded-md border border-[#2b2b2f] bg-[#1f1f23] shadow-lg">
                          <button
                            className="w-full flex items-center gap-2 px-3 py-2 text-left text-[#a1a1aa] hover:bg-[#2b2b2f]"
                            onClick={() => {
                              setOpenMenuIndex(null)
                              startEdit(actualIndex)
                            }}
                          >
                            <Pencil className="w-4 h-4" />
                            Edit Holdings
                          </button>
                          <div className="h-px bg-[#2b2b2f]"></div>
                          <button
                            className="w-full flex items-center gap-2 px-3 py-2 text-left text-[#fb7185] hover:bg-[#2b2b2f]"
                            onClick={() => removeToken(actualIndex)}
                          >
                            <Trash className="w-4 h-4" />
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between pt-4 text-sm text-[#71717a]">
              <div>
                {startIndex + 1} — {Math.min(endIndex, data.length)} of {data.length} results
              </div>
              <div className="flex items-center gap-4">
                <span>{currentPage} of {totalPages} pages</span>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    disabled={currentPage === 1} 
                    className="text-[#71717a] hover:text-[#e4e4e7] disabled:hover:text-[#71717a]"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Prev
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    disabled={currentPage === totalPages}
                    className="text-[#a1a1aa] hover:text-[#e4e4e7] disabled:hover:text-[#71717a]"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Add Token Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-20">
          <div className="absolute inset-0 bg-black/60" onClick={() => setIsAddOpen(false)}></div>
          <div className="absolute left-1/2 top-16 -translate-x-1/2 w-[640px] max-w-[95vw] rounded-lg border border-[#2b2b2f] bg-[#1f1f23] shadow-2xl">
            <div className="p-4 border-b border-[#2b2b2f]">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tokens (e.g., ETH, SOL)..."
                className="w-full bg-[#151519] border border-[#2b2b2f] rounded-md px-3 py-2 text-sm text-white placeholder:text-[#71717a] focus:outline-none focus:ring-2 focus:ring-[#a9e851]"
              />
            </div>
            <div className="max-h-[360px] overflow-auto">
              <div className="px-4 py-2 text-xs text-[#a1a1aa]">Trending</div>
              <div className="py-1">
                {allTokens
                  .filter((t) => !data.some((d) => d.symbol === t.symbol) || selected[t.symbol])
                  .filter((t) =>
                    (t.name + t.symbol).toLowerCase().includes(search.trim().toLowerCase())
                  )
                  .map((t) => (
                    <button
                      key={t.symbol}
                      className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[#2b2b2f] ${
                        selected[t.symbol] ? "bg-[#2a341d]" : ""
                      }`}
                      onClick={() => toggleSelect(t.symbol)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm">
                          {t.icon}
                        </div>
                        <div className="text-sm text-white">{t.name} ({t.symbol})</div>
                      </div>
                      <div className="flex items-center gap-3">
                        {t.changePositive ? (
                          <Star className="w-4 h-4 text-[#a9e851]" fill="currentColor" />
                        ) : (
                          <Star className="w-4 h-4 text-[#3a3a3f]" />
                        )}
                        <div
                          className={`h-4 w-4 rounded-full border ${
                            selected[t.symbol]
                              ? "bg-[#a9e851] border-[#a9e851]"
                              : "border-[#3a3a3f]"
                          }`}
                        />
                      </div>
                    </button>
                  ))}
              </div>
            </div>
            <div className="p-4 border-t border-[#2b2b2f] flex items-center justify-end">
              <Button
                className="bg-[#a9e851] text-[#212124] hover:bg-[#a9e851]/90"
                onClick={addSelectedTokens}
                disabled={!Object.values(selected).some(Boolean)}
              >
                Add to Watchlist
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
