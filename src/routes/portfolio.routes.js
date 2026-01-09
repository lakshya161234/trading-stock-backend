import { Router } from "express"
import { getPortfolio } from "../controllers/portfolio.controller.js"

const router = Router()

/**
 * @swagger
 * /api/v1/portfolio:
 *   get:
 *     summary: Get current portfolio holdings
 *     tags: [Portfolio]
 *     responses:
 *       200:
 *         description: Portfolio holdings and summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/PortfolioResponse'
 */
router.get("/", getPortfolio)

export default router
