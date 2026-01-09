import db from "../db/database.js"

export const getAllTrades = (req, res) => {
  const trades = db
    .prepare(`
    SELECT t.*, o.side, o.orderType 
    FROM trades t 
    JOIN orders o ON t.orderId = o.id 
    ORDER BY t.executedAt DESC
  `)
    .all()

  console.log(`📈 Fetched ${trades.length} trades`)

  res.json({
    success: true,
    data: trades,
  })
}

export const getTradesByOrderId = (req, res) => {
  const { orderId } = req.params

  const trades = db
    .prepare(`
    SELECT t.*, o.side, o.orderType 
    FROM trades t 
    JOIN orders o ON t.orderId = o.id 
    WHERE t.orderId = ?
    ORDER BY t.executedAt DESC
  `)
    .all(orderId)

  res.json({
    success: true,
    data: trades,
  })
}
