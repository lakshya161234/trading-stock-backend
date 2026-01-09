import app from "./app.js"

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`
🚀 Trading API Server is running!
📍 URL: http://localhost:${PORT}
📚 API Base: http://localhost:${PORT}/api/v1

Available endpoints:
  GET    /api/v1/instruments     - List all instruments
  GET    /api/v1/instruments/:symbol - Get instrument by symbol
  POST   /api/v1/orders          - Place a new order
  GET    /api/v1/orders          - List all orders
  GET    /api/v1/orders/:orderId - Get order status
  GET    /api/v1/trades          - List all trades
  GET    /api/v1/portfolio       - Get portfolio holdings
  GET    /health                 - Health check
  GET    /api-docs               - Swagger/OpenAPI documentation

📚 API Documentation: http://localhost:${PORT}/api-docs
  `)
})
