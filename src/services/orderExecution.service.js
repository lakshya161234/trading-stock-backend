import db from "../db/database.js"
import { ORDER_STATUS, ORDER_SIDES } from "../utils/constants.js"

export const executeOrder = (orderId, executionPrice) => {
  const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(orderId)

  if (!order) {
    throw new Error(`Order ${orderId} not found`)
  }

  // Begin transaction for atomicity
  const executeTransaction = db.transaction(() => {
    // Update order status to EXECUTED
    db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(ORDER_STATUS.EXECUTED, orderId)

    // Create trade record
    const insertTrade = db.prepare(`
      INSERT INTO trades (orderId, symbol, quantity, price)
      VALUES (?, ?, ?, ?)
    `)

    const tradeResult = insertTrade.run(orderId, order.symbol, order.quantity, executionPrice)

    console.log(
      `✅ Trade executed: ID=${tradeResult.lastInsertRowid}, ${order.side} ${order.quantity} ${order.symbol} @ $${executionPrice}`,
    )

    // Update portfolio
    updatePortfolio(order.symbol, order.side, order.quantity, executionPrice)

    // Return updated order
    return db.prepare("SELECT * FROM orders WHERE id = ?").get(orderId)
  })

  return executeTransaction()
}

const updatePortfolio = (symbol, side, quantity, price) => {
  const existingPosition = db.prepare("SELECT * FROM portfolio WHERE symbol = ?").get(symbol)

  if (side === ORDER_SIDES.BUY) {
    if (existingPosition) {
      // Calculate new average price
      const totalQuantity = existingPosition.quantity + quantity
      const totalCost = existingPosition.quantity * existingPosition.averagePrice + quantity * price
      const newAveragePrice = totalCost / totalQuantity

      db.prepare("UPDATE portfolio SET quantity = ?, averagePrice = ? WHERE symbol = ?").run(
        totalQuantity,
        newAveragePrice,
        symbol,
      )

      console.log(`💼 Portfolio updated: ${symbol} quantity=${totalQuantity}, avgPrice=$${newAveragePrice.toFixed(2)}`)
    } else {
      db.prepare("INSERT INTO portfolio (symbol, quantity, averagePrice) VALUES (?, ?, ?)").run(symbol, quantity, price)

      console.log(`💼 New position added: ${symbol} quantity=${quantity}, avgPrice=$${price.toFixed(2)}`)
    }
  } else if (side === ORDER_SIDES.SELL) {
    if (existingPosition) {
      const newQuantity = existingPosition.quantity - quantity

      if (newQuantity <= 0) {
        db.prepare("DELETE FROM portfolio WHERE symbol = ?").run(symbol)
        console.log(`💼 Position closed: ${symbol}`)
      } else {
        db.prepare("UPDATE portfolio SET quantity = ? WHERE symbol = ?").run(newQuantity, symbol)
        console.log(`💼 Position reduced: ${symbol} quantity=${newQuantity}`)
      }
    } else {
      // Allow short selling - create negative position
      db.prepare("INSERT INTO portfolio (symbol, quantity, averagePrice) VALUES (?, ?, ?)").run(
        symbol,
        -quantity,
        price,
      )
      console.log(`💼 Short position opened: ${symbol} quantity=${-quantity}`)
    }
  }
}
