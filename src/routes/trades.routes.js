import { Router } from "express"
import { getAllTrades, getTradesByOrderId } from "../controllers/trades.controller.js"

const router = Router()

/**
 * @swagger
 * /api/v1/trades:
 *   get:
 *     summary: Get all executed trades
 *     tags: [Trades]
 *     responses:
 *       200:
 *         description: List of all trades
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Trade'
 */
router.get("/", getAllTrades)

/**
 * @swagger
 * /api/v1/trades/order/{orderId}:
 *   get:
 *     summary: Get trades for a specific order
 *     tags: [Trades]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     responses:
 *       200:
 *         description: List of trades for the order
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Trade'
 */
router.get("/order/:orderId", getTradesByOrderId)

export default router
