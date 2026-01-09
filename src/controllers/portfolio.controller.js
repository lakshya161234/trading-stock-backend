import db from "../db/database.js"

export const getPortfolio = (req, res) => {
  const holdings = db
    .prepare(`
    SELECT 
      p.symbol,
      p.quantity,
      p.averagePrice,
      i.lastTradedPrice,
      (p.quantity * i.lastTradedPrice) as currentValue,
      ((i.lastTradedPrice - p.averagePrice) * p.quantity) as unrealizedPnL
    FROM portfolio p
    JOIN instruments i ON p.symbol = i.symbol
    WHERE p.quantity > 0
    ORDER BY currentValue DESC
  `)
    .all()

  const totalValue = holdings.reduce((sum, h) => sum + h.currentValue, 0)
  const totalPnL = holdings.reduce((sum, h) => sum + h.unrealizedPnL, 0)

  console.log(`💼 Portfolio fetched: ${holdings.length} holdings, Total Value: $${totalValue.toFixed(2)}`)

  res.json({
    success: true,
    data: {
      holdings,
      summary: {
        totalHoldings: holdings.length,
        totalValue: Math.round(totalValue * 100) / 100,
        totalUnrealizedPnL: Math.round(totalPnL * 100) / 100,
      },
    },
  })
}
