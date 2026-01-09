export const ORDER_SIDES = {
  BUY: "BUY",
  SELL: "SELL",
}

export const ORDER_TYPES = {
  MARKET: "MARKET",
  LIMIT: "LIMIT",
}

export const ORDER_STATUS = {
  NEW: "NEW",
  PLACED: "PLACED",
  EXECUTED: "EXECUTED",
  CANCELLED: "CANCELLED",
}

export const SAMPLE_INSTRUMENTS = [
  { symbol: "AAPL", exchange: "NASDAQ", instrumentType: "STOCK", lastTradedPrice: 178.5 },
  { symbol: "GOOGL", exchange: "NASDAQ", instrumentType: "STOCK", lastTradedPrice: 141.25 },
  { symbol: "MSFT", exchange: "NASDAQ", instrumentType: "STOCK", lastTradedPrice: 378.9 },
  { symbol: "AMZN", exchange: "NASDAQ", instrumentType: "STOCK", lastTradedPrice: 178.75 },
  { symbol: "TSLA", exchange: "NASDAQ", instrumentType: "STOCK", lastTradedPrice: 245.3 },
  { symbol: "META", exchange: "NASDAQ", instrumentType: "STOCK", lastTradedPrice: 505.15 },
  { symbol: "NVDA", exchange: "NASDAQ", instrumentType: "STOCK", lastTradedPrice: 875.4 },
  { symbol: "JPM", exchange: "NYSE", instrumentType: "STOCK", lastTradedPrice: 195.8 },
]
