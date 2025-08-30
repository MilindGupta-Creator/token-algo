"use client"

import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, RefreshCw, Plus, Star, Pencil, Trash, ChevronLeft, ChevronRight } from "lucide-react"
import { 
  fetchTopTokens, 
  searchTokens, 
  refreshTokenPrices, 
  convertCoinGeckoToken, 
  calculatePortfolioTotal,
  updateTokenValue,
  updateTokenWithPriceData,
  type Token,
} from "@/lib/coingecko"

const defaultPortfolioData: Token[] = [
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
    id: "bitcoin",
    priceValue: 43250.67,
    holdingsValue: 0.1534,
    valueAmount: 6635.80,
    priceChange24h: 2.30,
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
    id: "ethereum",
    priceValue: 2654.32,
    holdingsValue: 0.8150,
    valueAmount: 2162.53,
    priceChange24h: -1.20,
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
    id: "solana",
    priceValue: 98.45,
    holdingsValue: 15.0000,
    valueAmount: 1476.75,
    priceChange24h: 4.70,
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
    id: "dogecoin",
    priceValue: 0.0823,
    holdingsValue: 26250.0000,
    valueAmount: 2162.53,
    priceChange24h: 2.30,
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
    id: "usd-coin",
    priceValue: 1.00,
    holdingsValue: 535.0000,
    valueAmount: 535.00,
    priceChange24h: 0.00,
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
    id: "stellar",
    priceValue: 0.0985,
    holdingsValue: 15000.0000,
    valueAmount: 1476.75,
    priceChange24h: 4.70,
  },
]

// Default all tokens list (will be populated with API data)
const defaultAllTokens: Token[] = [
  ...defaultPortfolioData,
  { name: "Hyperliquid", symbol: "HYPE", price: "$12.34", change: "+1.2%", changePositive: true, holdings: "0.0000", value: "$0.00", sparkline: "up", icon: "✨", id: "hyperliquid", priceValue: 12.34, holdingsValue: 0.0000, valueAmount: 0.00, priceChange24h: 1.2 },
  { name: "PinLink", symbol: "PIN", price: "$1.02", change: "-0.5%", changePositive: false, holdings: "0.0000", value: "$0.00", sparkline: "down", icon: "📌", id: "pinlink", priceValue: 1.02, holdingsValue: 0.0000, valueAmount: 0.00, priceChange24h: -0.5 },
  { name: "Stader", symbol: "SD", price: "$0.85", change: "+0.3%", changePositive: true, holdings: "0.0000", value: "$0.00", sparkline: "up", icon: "⭐", id: "stader", priceValue: 0.85, holdingsValue: 0.0000, valueAmount: 0.00, priceChange24h: 0.3 },
  { name: "Avalanche", symbol: "AVAX", price: "$34.22", change: "+2.1%", changePositive: true, holdings: "0.0000", value: "$0.00", sparkline: "up", icon: "🏔️", id: "avalanche-2", priceValue: 34.22, holdingsValue: 0.0000, valueAmount: 0.00, priceChange24h: 2.1 },
  { name: "Polygon", symbol: "MATIC", price: "$0.87", change: "-0.4%", changePositive: false, holdings: "0.0000", value: "$0.00", sparkline: "down", icon: "🟪", id: "matic-network", priceValue: 0.87, holdingsValue: 0.0000, valueAmount: 0.00, priceChange24h: -0.4 },
  { name: "Cardano", symbol: "ADA", price: "$0.52", change: "+0.8%", changePositive: true, holdings: "0.0000", value: "$0.00", sparkline: "up", icon: "🟦", id: "cardano", priceValue: 0.52, holdingsValue: 0.0000, valueAmount: 0.00, priceChange24h: 0.8 },
  { name: "Ripple", symbol: "XRP", price: "$0.62", change: "-1.2%", changePositive: false, holdings: "0.0000", value: "$0.00", sparkline: "down", icon: "💧", id: "ripple", priceValue: 0.62, holdingsValue: 0.0000, valueAmount: 0.00, priceChange24h: -1.2 },
  { name: "BNB", symbol: "BNB", price: "$398.10", change: "+0.5%", changePositive: true, holdings: "0.0000", value: "$0.00", sparkline: "up", icon: "🟡", id: "binancecoin", priceValue: 398.10, holdingsValue: 0.0000, valueAmount: 0.00, priceChange24h: 0.5 },
  { name: "Polkadot", symbol: "DOT", price: "$6.22", change: "-0.6%", changePositive: false, holdings: "0.0000", value: "$0.00", sparkline: "down", icon: "🎯", id: "polkadot", priceValue: 6.22, holdingsValue: 0.0000, valueAmount: 0.00, priceChange24h: -0.6 },
  { name: "Chainlink", symbol: "LINK", price: "$17.44", change: "+1.9%", changePositive: true, holdings: "0.0000", value: "$0.00", sparkline: "up", icon: "🔗", id: "chainlink", priceValue: 17.44, holdingsValue: 0.0000, valueAmount: 0.00, priceChange24h: 1.9 },
  { name: "Arbitrum", symbol: "ARB", price: "$1.24", change: "+0.2%", changePositive: true, holdings: "0.0000", value: "$0.00", sparkline: "up", icon: "🌀", id: "arbitrum", priceValue: 1.24, holdingsValue: 0.0000, valueAmount: 0.00, priceChange24h: 0.2 },
  { name: "Aptos", symbol: "APT", price: "$9.15", change: "-0.8%", changePositive: false, holdings: "0.0000", value: "$0.00", sparkline: "down", icon: "🅰️", id: "aptos", priceValue: 9.15, holdingsValue: 0.0000, valueAmount: 0.00, priceChange24h: -0.8 },
  { name: "Optimism", symbol: "OP", price: "$2.34", change: "+0.7%", changePositive: true, holdings: "0.0000", value: "$0.00", sparkline: "up", icon: "🟥", id: "optimism", priceValue: 2.34, holdingsValue: 0.0000, valueAmount: 0.00, priceChange24h: 0.7 },
  { name: "Sui", symbol: "SUI", price: "$1.12", change: "-0.3%", changePositive: false, holdings: "0.0000", value: "$0.00", sparkline: "down", icon: "💠", id: "sui", priceValue: 1.12, holdingsValue: 0.0000, valueAmount: 0.00, priceChange24h: -0.3 },
  { name: "Injective", symbol: "INJ", price: "$27.02", change: "+3.1%", changePositive: true, holdings: "0.0000", value: "$0.00", sparkline: "up", icon: "🧪", id: "injective", priceValue: 27.02, holdingsValue: 0.0000, valueAmount: 0.00, priceChange24h: 3.1 },
  { name: "NEAR", symbol: "NEAR", price: "$5.42", change: "+0.6%", changePositive: true, holdings: "0.0000", value: "$0.00", sparkline: "up", icon: "📍", id: "near", priceValue: 5.42, holdingsValue: 0.0000, valueAmount: 0.00, priceChange24h: 0.6 },
  { name: "TRON", symbol: "TRX", price: "$0.12", change: "-0.2%", changePositive: false, holdings: "0.0000", value: "$0.00", sparkline: "down", icon: "🚀", id: "tron", priceValue: 0.12, holdingsValue: 0.0000, valueAmount: 0.00, priceChange24h: -0.2 },
  { name: "Litecoin", symbol: "LTC", price: "$82.40", change: "+0.1%", changePositive: true, holdings: "0.0000", value: "$0.00", sparkline: "up", icon: "💡", id: "litecoin", priceValue: 82.40, holdingsValue: 0.0000, valueAmount: 0.00, priceChange24h: 0.1 },
]

// Chart data will be calculated dynamically based on portfolio data
const getChartData = (data: Token[]) => {
  const totalValue = calculatePortfolioTotal(data)
  
  return data
    .map(token => {
      const percentage = totalValue > 0 ? (token.valueAmount / totalValue) * 100 : 0
      return {
        name: `${token.name} (${token.symbol})`,
        percentage: Math.round(percentage * 10) / 10,
        color: getTokenColor(token.symbol)
      }
    })
    .filter(item => item.percentage > 0)
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 6)
}

// Get token color for chart
const getTokenColor = (symbol: string): string => {
  const colorMap: Record<string, string> = {
    'BTC': '#f7931a',
    'ETH': '#627eea',
    'SOL': '#14f195',
    'DOGE': '#c2a633',
    'USDC': '#2775ca',
    'XLM': '#000000',
    'BNB': '#f3ba2f',
    'ADA': '#0033ad',
    'XRP': '#23292f',
    'DOT': '#e6007a',
    'LINK': '#2a5ada',
    'MATIC': '#8247e5',
    'AVAX': '#e84142',
    'LTC': '#a6a9aa',
    'TRX': '#ff060a',
    'NEAR': '#000000',
    'INJ': '#00b4ff',
    'APT': '#0055ff',
    'OP': '#ff0420',
    'SUI': '#6fbcf0',
    'ARB': '#28a0f0',
  }
  return colorMap[symbol] || '#71717a'
}

// Calculate portfolio 24h change
const calculatePortfolioChange = (tokens: Token[]) => {
  const totalValue = calculatePortfolioTotal(tokens)
  if (totalValue === 0) return { change: 0, percentage: 0 }
  
  const change = tokens.reduce((sum, token) => sum + (token.priceChange24h * token.valueAmount / 100), 0)
  const percentage = tokens.reduce((sum, token) => sum + (token.priceChange24h * token.valueAmount / totalValue), 0)
  
  return { change, percentage }
}

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

function DonutChart({ data }: { data: Token[] }) {
  let cumulativePercentage = 0
  const chartData = getChartData(data)

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
        <div className="text-2xl font-bold text-white">${calculatePortfolioTotal(data).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
        <div className="text-xs text-[#71717a]">Total Value</div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const [data, setData] = useState<Token[]>(defaultPortfolioData)
  const [allTokens, setAllTokens] = useState<Token[]>(defaultAllTokens)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editValue, setEditValue] = useState<string>("")
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [searchResults, setSearchResults] = useState<Token[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // Load initial data from CoinGecko API
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true)
        
        // Fetch top 100 tokens for the all tokens list
        const topTokens = await fetchTopTokens(100)
        const convertedTokens = topTokens.map(token => convertCoinGeckoToken(token))
        setAllTokens(convertedTokens)
        
        // Update portfolio data with real prices
        const portfolioIds = defaultPortfolioData.map(token => token.id)
        const portfolioTokens = topTokens.filter(token => portfolioIds.includes(token.id))
        
        const updatedPortfolio = defaultPortfolioData.map(token => {
          const apiToken = portfolioTokens.find(t => t.id === token.id)
          if (apiToken) {
            return updateTokenWithPriceData(token, apiToken)
          }
          return token
        })
        
        setData(updatedPortfolio)
        setLastUpdated(new Date())
      } catch (error) {
        console.error('Error loading initial data:', error)
        // Keep using default data if API fails
      } finally {
        setIsLoading(false)
      }
    }

    loadInitialData()
  }, [])

  // Update timestamp every minute and refresh prices every 5 minutes
  useEffect(() => {
    const timestampInterval = setInterval(() => {
      setLastUpdated(new Date())
    }, 60000)
    
    const priceRefreshInterval = setInterval(async () => {
      if (data.length > 0 && !isRefreshing) {
        try {
          const tokenIds = data.map(token => token.id)
          const updatedTokens = await refreshTokenPrices(tokenIds)
          
          const updatedData = data.map(token => {
            const apiToken = updatedTokens.find(t => t.id === token.id)
            if (apiToken) {
              return updateTokenWithPriceData(token, apiToken)
            }
            return token
          })
          
          setData(updatedData)
        } catch (error) {
          console.error('Auto refresh failed:', error)
        }
      }
    }, 300000) // Refresh every 5 minutes
    
    return () => {
      clearInterval(timestampInterval)
      clearInterval(priceRefreshInterval)
    }
  }, [data, isRefreshing])

  // Search tokens when search query changes
  useEffect(() => {
    const searchTokensDebounced = async () => {
      if (search.trim().length < 2) {
        setSearchResults([])
        return
      }

      try {
        setIsSearching(true)
        const results = await searchTokens(search.trim())
        const convertedResults = results.map(token => convertCoinGeckoToken(token))
        setSearchResults(convertedResults)
      } catch (error) {
        console.error('Error searching tokens:', error)
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }

    const timeoutId = setTimeout(searchTokensDebounced, 500)
    return () => clearTimeout(timeoutId)
  }, [search])

  // Calculate pagination
  const totalPages = Math.ceil(data.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = data.slice(startIndex, endIndex)

  // Refresh prices functionality
  const refreshPrices = async () => {
    setIsRefreshing(true)
    
    try {
      // Get current token IDs from portfolio
      const tokenIds = data.map(token => token.id)
      
      // Fetch updated prices from CoinGecko
      const updatedTokens = await refreshTokenPrices(tokenIds)
      
      // Update portfolio data with new prices
      const updatedData = data.map(token => {
        const apiToken = updatedTokens.find(t => t.id === token.id)
        if (apiToken) {
          return updateTokenWithPriceData(token, apiToken)
        }
        return token
      })
      
      setData(updatedData)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Error refreshing prices:', error)
      // Keep existing data if refresh fails
    } finally {
      setIsRefreshing(false)
    }
  }

  const startEdit = (index: number) => {
    setEditingIndex(index)
    setEditValue(String(data[index].holdings))
  }

  const saveEdit = (index: number) => {
    const next = [...data]
    const numeric = Number(editValue)
    const newHoldings = isNaN(numeric) ? editValue : numeric.toFixed(4)
    next[index] = updateTokenValue(next[index], newHoldings)
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
    setSearchResults([])
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
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin text-[#a9e851]" />
              <p className="text-[#71717a]">Loading token data...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Portfolio Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Portfolio Total */}
          <div>
            <h2 className="text-[#a1a1aa] text-sm mb-4">Portfolio Total</h2>
            <div className="text-5xl font-bold mb-2">
              ${calculatePortfolioTotal(data).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-2 mb-2">
              {(() => {
                const { change, percentage } = calculatePortfolioChange(data)
                return (
                  <Badge
                    variant="secondary"
                    className={`${
                      change >= 0
                        ? "bg-[#32ca5b]/20 text-[#32ca5b] border-[#32ca5b]/30"
                        : "bg-[#fb7185]/20 text-[#fb7185] border-[#fb7185]/30"
                    }`}
                  >
                    {change >= 0 ? '+' : ''}${change.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({percentage.toFixed(2)}%)
                  </Badge>
                )
              })()}
              <span className="text-[#71717a] text-sm">24h change</span>
            </div>
            <p className="text-[#71717a] text-sm flex items-center gap-2">
              <span>Last updated: {lastUpdated.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true })}</span>
              {isRefreshing && (
                <RefreshCw className="w-3 h-3 animate-spin text-[#a9e851]" />
              )}
            </p>
          </div>

          {/* Portfolio Chart */}
          <div>
            <h2 className="text-[#a1a1aa] text-sm mb-4">Portfolio Distribution</h2>
            <div className="flex items-center gap-8 sm:flex-col lg:flex-row">
              <DonutChart data={data} />
              <div className="space-y-3">
                {getChartData(data).slice(0, 5).map((item, index) => (
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
          </>
        )}
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
              {isSearching ? (
                <div className="px-4 py-8 text-center text-[#71717a]">
                  <RefreshCw className="w-6 h-6 mx-auto mb-2 animate-spin" />
                  Searching tokens...
                </div>
              ) : search.trim().length >= 2 ? (
                <div>
                  <div className="px-4 py-2 text-xs text-[#a1a1aa]">Search Results</div>
                  <div className="py-1">
                    {searchResults
                      .filter((t) => !data.some((d) => d.symbol === t.symbol) || selected[t.symbol])
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
                            <Badge
                              variant="secondary"
                              className={`${
                                t.changePositive
                                  ? "bg-[#32ca5b]/20 text-[#32ca5b] border-[#32ca5b]/30"
                                  : "bg-[#fb7185]/20 text-[#fb7185] border-[#fb7185]/30"
                              }`}
                            >
                              {t.change}
                            </Badge>
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
                    {searchResults.length === 0 && (
                      <div className="px-4 py-8 text-center text-[#71717a]">
                        No tokens found for &quot;{search}&quot;
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="px-4 py-2 text-xs text-[#a1a1aa]">Trending</div>
                  <div className="py-1">
                    {allTokens
                      .filter((t) => !data.some((d) => d.symbol === t.symbol) || selected[t.symbol])
                      .slice(0, 20)
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
                            <Badge
                              variant="secondary"
                              className={`${
                                t.changePositive
                                  ? "bg-[#32ca5b]/20 text-[#32ca5b] border-[#32ca5b]/30"
                                  : "bg-[#fb7185]/20 text-[#fb7185] border-[#fb7185]/30"
                              }`}
                            >
                              {t.change}
                            </Badge>
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
              )}
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
