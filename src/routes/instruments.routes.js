import { Router } from "express"
import { getAllInstruments, getInstrumentBySymbol } from "../controllers/instruments.controller.js"

const router = Router()

/**
 * @swagger
 * /api/v1/instruments:
 *   get:
 *     summary: Get all available trading instruments
 *     tags: [Instruments]
 *     responses:
 *       200:
 *         description: List of all instruments
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
 *                     $ref: '#/components/schemas/Instrument'
 */
router.get("/", getAllInstruments)

/**
 * @swagger
 * /api/v1/instruments/{symbol}:
 *   get:
 *     summary: Get instrument by symbol
 *     tags: [Instruments]
 *     parameters:
 *       - in: path
 *         name: symbol
 *         required: true
 *         schema:
 *           type: string
 *         description: Instrument symbol (e.g., AAPL)
 *     responses:
 *       200:
 *         description: Instrument details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Instrument'
 *       404:
 *         description: Instrument not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:symbol", getInstrumentBySymbol)

export default router
