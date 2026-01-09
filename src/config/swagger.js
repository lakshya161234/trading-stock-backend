import swaggerJsdoc from "swagger-jsdoc"

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Trading API Backend",
      version: "1.0.0",
      description: "A simplified Trading API platform with SDK wrapper for trading operations",
      contact: {
        name: "API Support",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    tags: [
      { name: "Instruments", description: "Financial instruments operations" },
      { name: "Orders", description: "Order management operations" },
      { name: "Trades", description: "Trade history operations" },
      { name: "Portfolio", description: "Portfolio management operations" },
      { name: "Health", description: "Health check endpoints" },
    ],
    components: {
      schemas: {
        Instrument: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            symbol: { type: "string", example: "AAPL" },
            exchange: { type: "string", example: "NASDAQ" },
            instrumentType: { type: "string", example: "STOCK" },
            lastTradedPrice: { type: "number", format: "float", example: 178.5 },
          },
        },
        Order: {
          type: "object",
          required: ["symbol", "side", "orderType", "quantity"],
          properties: {
            symbol: { type: "string", example: "AAPL" },
            side: { type: "string", enum: ["BUY", "SELL"], example: "BUY" },
            orderType: { type: "string", enum: ["MARKET", "LIMIT"], example: "MARKET" },
            quantity: { type: "integer", minimum: 1, example: 10 },
            price: { type: "number", format: "float", example: 180.0, description: "Required for LIMIT orders" },
          },
        },
        OrderResponse: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            symbol: { type: "string", example: "AAPL" },
            side: { type: "string", enum: ["BUY", "SELL"], example: "BUY" },
            orderType: { type: "string", enum: ["MARKET", "LIMIT"], example: "MARKET" },
            quantity: { type: "integer", example: 10 },
            price: { type: "number", format: "float", example: 178.5 },
            status: { type: "string", enum: ["NEW", "PLACED", "EXECUTED", "CANCELLED"], example: "EXECUTED" },
            createdAt: { type: "string", format: "date-time", example: "2024-01-15T10:30:00.000Z" },
          },
        },
        Trade: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            orderId: { type: "integer", example: 1 },
            symbol: { type: "string", example: "AAPL" },
            quantity: { type: "integer", example: 10 },
            price: { type: "number", format: "float", example: 178.5 },
            executedAt: { type: "string", format: "date-time", example: "2024-01-15T10:30:00.000Z" },
            side: { type: "string", enum: ["BUY", "SELL"], example: "BUY" },
            orderType: { type: "string", enum: ["MARKET", "LIMIT"], example: "MARKET" },
          },
        },
        PortfolioHolding: {
          type: "object",
          properties: {
            symbol: { type: "string", example: "AAPL" },
            quantity: { type: "integer", example: 10 },
            averagePrice: { type: "number", format: "float", example: 178.5 },
            lastTradedPrice: { type: "number", format: "float", example: 180.0 },
            currentValue: { type: "number", format: "float", example: 1800.0 },
            unrealizedPnL: { type: "number", format: "float", example: 15.0 },
          },
        },
        PortfolioResponse: {
          type: "object",
          properties: {
            holdings: {
              type: "array",
              items: { $ref: "#/components/schemas/PortfolioHolding" },
            },
            summary: {
              type: "object",
              properties: {
                totalHoldings: { type: "integer", example: 1 },
                totalValue: { type: "number", format: "float", example: 1800.0 },
                totalUnrealizedPnL: { type: "number", format: "float", example: 15.0 },
              },
            },
          },
        },
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: { type: "object" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            error: {
              type: "object",
              properties: {
                message: { type: "string", example: "Error description here" },
              },
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js", "./src/app.js", "./src/server.js"],
}

export const swaggerSpec = swaggerJsdoc(options)
