import express from "express"
import swaggerUi from "swagger-ui-express"
import { swaggerSpec } from "./config/swagger.js"
import instrumentsRoutes from "./routes/instruments.routes.js"
import ordersRoutes from "./routes/orders.routes.js"
import tradesRoutes from "./routes/trades.routes.js"
import portfolioRoutes from "./routes/portfolio.routes.js"
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js"

const app = express()

// Middleware
app.use(express.json())

// Request logging
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`)
  next()
})

// Swagger/OpenAPI Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: ".swagger-ui .topbar { display: none }",
  customSiteTitle: "Trading API Documentation",
}))

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() })
})

// API Routes
app.use("/api/v1/instruments", instrumentsRoutes)
app.use("/api/v1/orders", ordersRoutes)
app.use("/api/v1/trades", tradesRoutes)
app.use("/api/v1/portfolio", portfolioRoutes)

// Error handling
app.use(notFoundHandler)
app.use(errorHandler)

export default app
