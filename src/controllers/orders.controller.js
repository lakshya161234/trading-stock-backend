import db from "../db/database.js"
import { executeOrder } from "../services/orderExecution.service.js"
import { AppError } from "../middlewares/errorHandler.js"
import { ORDER_TYPES, ORDER_SIDES } from "../utils/constants.js"

export const placeOrder = (req, res, next) => {
  try {
    const { symbol, side, orderType, quantity, price } = req.body

    // Validate required fields
    if (!symbol || !side || !orderType || !quantity) {
      throw new AppError("Missing required fields: symbol, side, orderType, quantity", 400)
    }

    // Validate side
    if (!Object.values(ORDER_SIDES).includes(side.toUpperCase())) {
      throw new AppError("Invalid side. Must be BUY or SELL", 400)
    }

    // Validate orderType
    if (!Object.values(ORDER_TYPES).includes(orderType.toUpperCase())) {
      throw new AppError("Invalid orderType. Must be MARKET or LIMIT", 400)
    }

    // Validate quantity
    if (typeof quantity !== "number" || quantity <= 0) {
      throw new AppError("Quantity must be a positive number", 400)
    }

    // Validate price for LIMIT orders
    if (orderType.toUpperCase() === ORDER_TYPES.LIMIT && (!price || price <= 0)) {
      throw new AppError("Price is required and must be positive for LIMIT orders", 400)
    }

    // Check if instrument exists
    const instrument = db.prepare("SELECT * FROM instruments WHERE symbol = ?").get(symbol.toUpperCase())
    if (!instrument) {
      throw new AppError(`Instrument ${symbol} not found`, 404)
    }

    // Create the order
    const insertOrder = db.prepare(`
      INSERT INTO orders (symbol, side, orderType, quantity, price, status)
      VALUES (?, ?, ?, ?, ?, 'NEW')
    `)

    const executionPrice = orderType.toUpperCase() === ORDER_TYPES.MARKET ? instrument.lastTradedPrice : price

    const result = insertOrder.run(
      symbol.toUpperCase(),
      side.toUpperCase(),
      orderType.toUpperCase(),
      quantity,
      executionPrice,
    )

    const orderId = result.lastInsertRowid
    console.log(`📝 Order placed: ID=${orderId}, ${side} ${quantity} ${symbol} @ ${executionPrice}`)

    // Execute the order immediately (both MARKET and LIMIT for simplicity)
    const executedOrder = executeOrder(orderId, executionPrice)

    res.status(201).json({
      success: true,
      data: executedOrder,
    })
  } catch (error) {
    next(error)
  }
}

export const getOrderById = (req, res, next) => {
  try {
    const { orderId } = req.params

    const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(orderId)

    if (!order) {
      throw new AppError(`Order ${orderId} not found`, 404)
    }

    res.json({
      success: true,
      data: order,
    })
  } catch (error) {
    next(error)
  }
}

export const getAllOrders = (req, res) => {
  const orders = db.prepare("SELECT * FROM orders ORDER BY createdAt DESC").all()

  res.json({
    success: true,
    data: orders,
  })
}
