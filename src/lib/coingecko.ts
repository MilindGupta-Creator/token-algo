// CoinGecko API service
const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3'

export interface CoinGeckoToken {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  fully_diluted_valuation: number | null
  total_volume: number
  high_24h: number
  low_24h: number
  price_change_24h: number
  price_change_percentage_24h: number
  market_cap_change_24h: number
  market_cap_change_percentage_24h: number
  circulating_supply: number
  total_supply: number | null
  max_supply: number | null
  ath: number
  ath_change_percentage: number
  ath_date: string
  atl: number
  atl_change_percentage: number
  atl_date: string
  roi: {
    currency: string
    percentage: number
  } | null
  last_updated: string
  sparkline_in_7d?: {
    price: number[]
  }
}

export interface Token {
  name: string
  symbol: string
  price: string
  change: string
  changePositive: boolean
  holdings: string
  value: string
  sparkline: string
  icon: string
  id: string
  holdingsValue: number
  valueAmount: number
  priceValue: number
  priceChange24h: number
}

// Convert CoinGecko token to our Token interface
export function convertCoinGeckoToken(coinGeckoToken: CoinGeckoToken, holdings: string = "0.0000"): Token {
  const price = coinGeckoToken.current_price
  const priceChange = coinGeckoToken.price_change_percentage_24h
  const holdingsNum = parseFloat(holdings)
  const value = price * holdingsNum

  // Determine sparkline trend based on 24h change
  let sparkline = "flat"
  if (priceChange > 1) sparkline = "up"
  else if (priceChange < -1) sparkline = "down"

  // Get emoji icon based on symbol (you can expand this mapping)
  const iconMap: Record<string, string> = {
    'bitcoin': '🟠',
    'ethereum': '🔷',
    'solana': '🟣',
    'dogecoin': '🐕',
    'usd-coin': '🔵',
    'stellar': '⭐',
    'binancecoin': '🟡',
    'cardano': '🟦',
    'ripple': '💧',
    'polkadot': '🎯',
    'chainlink': '🔗',
    'polygon': '🟪',
    'avalanche-2': '🏔️',
    'litecoin': '💡',
    'tron': '🚀',
    'near': '📍',
    'injective': '🧪',
    'aptos': '🅰️',
    'optimism': '🟥',
    'sui': '💠',
    'arbitrum': '🌀',
  }

  return {
    name: coinGeckoToken.name,
    symbol: coinGeckoToken.symbol.toUpperCase(),
    price: `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`,
    change: `${priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)}%`,
    changePositive: priceChange >= 0,
    holdings,
    value: `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    sparkline,
    icon: iconMap[coinGeckoToken.id] || '🪙',
    id: coinGeckoToken.id,
    holdingsValue: holdingsNum,
    valueAmount: value,
    priceValue: price,
    priceChange24h: priceChange
  }
}


export function calculatePortfolioTotal(tokens: Token[]): number {
  return tokens.reduce((total, token) => total + token.valueAmount, 0)
}

export function updateTokenValue(token: Token, newHoldings: string): Token {
  const holdingsNum = parseFloat(newHoldings)
  const value = token.priceValue * holdingsNum
  
  return {
    ...token,
    holdings: newHoldings,
    holdingsValue: holdingsNum,
    valueAmount: value,
    value: `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }
}


export function updateTokenWithPriceData(token: Token, coinGeckoToken: CoinGeckoToken): Token {
  const price = coinGeckoToken.current_price
  const priceChange = coinGeckoToken.price_change_percentage_24h
  const value = price * token.holdingsValue

  let sparkline = "flat"
  if (priceChange > 1) sparkline = "up"
  else if (priceChange < -1) sparkline = "down"

  return {
    ...token,
    price: `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`,
    change: `${priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)}%`,
    changePositive: priceChange >= 0,
    value: `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    sparkline,
    priceValue: price,
    valueAmount: value,
    priceChange24h: priceChange
  }
}

// Fetch top tokens by market cap
export async function fetchTopTokens(limit: number = 100): Promise<CoinGeckoToken[]> {
  try {
    const response = await fetch(
      `${COINGECKO_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=true&locale=en`
    )
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching top tokens:', error)
    throw error
  }
}

// Search tokens by query
export async function searchTokens(query: string): Promise<CoinGeckoToken[]> {
  try {
    const response = await fetch(
      `${COINGECKO_BASE_URL}/search?query=${encodeURIComponent(query)}`
    )
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const searchData = await response.json()
    
    // Get detailed data for the first 20 results
    const coinIds = searchData.coins.slice(0, 20).map((coin: { id: string }) => coin.id).join(',')
    
    if (!coinIds) return []
    
    const detailedResponse = await fetch(
      `${COINGECKO_BASE_URL}/coins/markets?vs_currency=usd&ids=${coinIds}&order=market_cap_desc&sparkline=true&locale=en`
    )
    
    if (!detailedResponse.ok) {
      throw new Error(`HTTP error! status: ${detailedResponse.status}`)
    }
    
    const detailedData = await detailedResponse.json()
    return detailedData
  } catch (error) {
    console.error('Error searching tokens:', error)
    throw error
  }
}

// Get token price history for sparkline
export async function getTokenPriceHistory(tokenId: string, days: number = 7): Promise<number[]> {
  try {
    const response = await fetch(
      `${COINGECKO_BASE_URL}/coins/${tokenId}/market_chart?vs_currency=usd&days=${days}`
    )
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return data.prices.map((price: [number, number]) => price[1])
  } catch (error) {
    console.error('Error fetching price history:', error)
    throw error
  }
}

// Refresh prices for existing tokens
export async function refreshTokenPrices(tokenIds: string[]): Promise<CoinGeckoToken[]> {
  try {
    const ids = tokenIds.join(',')
    const response = await fetch(
      `${COINGECKO_BASE_URL}/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&sparkline=true&locale=en`
    )
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error refreshing token prices:', error)
    throw error
  }
}
