# Trading API Backend with SDK

A simplified Trading API platform with a JavaScript SDK wrapper. Built with Node.js, Express.js, and SQLite.

## 📋 Overview

This project implements a basic trading backend that allows users to:
- View available financial instruments
- Place buy and sell orders
- Check order status
- View executed trades
- Fetch basic portfolio holdings

The system represents a simplified trading backend with in-memory SQLite data storage.

## 🚀 Quick Start

### Prerequisites
- Node.js v18 or higher
- npm
- Optional: `jq` for pretty JSON output in demo script

### Installation

```bash
cd trading-backend
npm install
```

**Note:** This will install all dependencies including:
- Core dependencies: Express, SQLite
- Swagger/OpenAPI dependencies: swagger-jsdoc, swagger-ui-express
- Testing dependencies: supertest

### Running the Server

```bash
npm start
```

The server will start at `http://localhost:3000`

For development with auto-reload:
```bash
npm run dev
```

### Quick Demo

**Option 1: Using Demo Script (requires jq)**
```bash
./DEMO_COMMANDS.sh
```

**Option 2: Using SDK Demo**
```bash
node demo-sdk.js
```

**Option 3: Interactive Swagger UI**
Open browser: `http://localhost:3000/api-docs`

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### API Endpoints

#### 1. Instrument APIs

**Fetch list of tradable instruments**

```
GET /api/v1/instruments
```

**Instrument fields:**
- `symbol` - Stock symbol (e.g., "AAPL")
- `exchange` - Exchange name (e.g., "NASDAQ")
- `instrumentType` - Type of instrument (e.g., "STOCK")
- `lastTradedPrice` - Last traded price

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "symbol": "AAPL",
      "exchange": "NASDAQ",
      "instrumentType": "STOCK",
      "lastTradedPrice": 178.50
    }
  ]
}
```

#### 2. Order Management APIs

**Place a New Order**

```
POST /api/v1/orders
```

**Order Type:** BUY / SELL  
**Order Style:** MARKET / LIMIT

**Request Body:**
```json
{
  "symbol": "AAPL",
  "side": "BUY",
  "orderType": "MARKET",
  "quantity": 10,
  "price": null
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| symbol | string | Yes | Instrument symbol |
| side | string | Yes | BUY or SELL |
| orderType | string | Yes | MARKET or LIMIT |
| quantity | number | Yes | Must be > 0 |
| price | number | LIMIT only | Required for LIMIT orders |

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "symbol": "AAPL",
    "side": "BUY",
    "orderType": "MARKET",
    "quantity": 10,
    "price": 178.50,
    "status": "EXECUTED",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Fetch Order Status**

```
GET /api/v1/orders/:orderId
```

**Supported order states:**
- `NEW` - Order just created
- `PLACED` - Order placed in system
- `EXECUTED` - Order executed
- `CANCELLED` - Order cancelled

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "symbol": "AAPL",
    "side": "BUY",
    "orderType": "MARKET",
    "quantity": 10,
    "price": 178.50,
    "status": "EXECUTED",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### 3. Trade APIs

**Fetch list of executed trades for the user**

```
GET /api/v1/trades
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "orderId": 1,
      "symbol": "AAPL",
      "quantity": 10,
      "price": 178.50,
      "executedAt": "2024-01-15T10:30:00.000Z",
      "side": "BUY",
      "orderType": "MARKET"
    }
  ]
}
```

#### 4. Portfolio APIs

**Fetch current portfolio holdings**

```
GET /api/v1/portfolio
```

**Portfolio fields:**
- `symbol` - Stock symbol
- `quantity` - Number of shares held
- `averagePrice` - Average purchase price
- `currentValue` - Current market value (quantity × lastTradedPrice)

**Response:**
```json
{
  "success": true,
  "data": {
    "holdings": [
      {
        "symbol": "AAPL",
        "quantity": 10,
        "averagePrice": 178.50,
        "lastTradedPrice": 180.00,
        "currentValue": 1800.00,
        "unrealizedPnL": 15.00
      }
    ],
    "summary": {
      "totalHoldings": 1,
      "totalValue": 1800.00,
      "totalUnrealizedPnL": 15.00
    }
  }
}
```

## 🔧 Sample curl Commands

```bash
# Get all instruments
curl http://localhost:3000/api/v1/instruments

# Place a MARKET buy order
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{"symbol":"AAPL","side":"BUY","orderType":"MARKET","quantity":10}'

# Place a LIMIT sell order
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{"symbol":"AAPL","side":"SELL","orderType":"LIMIT","quantity":5,"price":180.00}'

# Get order status
curl http://localhost:3000/api/v1/orders/1

# Get all trades
curl http://localhost:3000/api/v1/trades

# Get portfolio
curl http://localhost:3000/api/v1/portfolio

# Health check
curl http://localhost:3000/health
```

## 📦 SDK Usage

The SDK provides a convenient wrapper around the REST API.

```javascript
import TradingSDK from './src/sdk/tradingSDK.js';

// Initialize SDK
const sdk = new TradingSDK('http://localhost:3000');

// Get all instruments
const instruments = await sdk.getInstruments();
console.log(instruments.data);

// Place a market buy order
const order = await sdk.placeOrder({
  symbol: 'AAPL',
  side: 'BUY',
  orderType: 'MARKET',
  quantity: 10
});
console.log('Order placed:', order.data);

// Using convenience methods
await sdk.buy('GOOGL', 5);  // Market buy
await sdk.sell('AAPL', 3);  // Market sell
await sdk.buy('MSFT', 10, { orderType: 'LIMIT', price: 375.00 });  // Limit buy

// Get order status
const status = await sdk.getOrderStatus(order.data.id);
console.log('Order status:', status.data.status);

// Get all trades
const trades = await sdk.getTrades();
console.log('Trades:', trades.data);

// Get portfolio
const portfolio = await sdk.getPortfolio();
console.log('Holdings:', portfolio.data.holdings);
console.log('Total Value:', portfolio.data.summary.totalValue);
```

## 📁 Project Structure

```
/trading-backend
 ├── src
 │   ├── app.js                 # Express app configuration
 │   ├── server.js              # Server entry point
 │   ├── db
 │   │   └── database.js        # SQLite setup and seeding
 │   ├── routes
 │   │   ├── instruments.routes.js
 │   │   ├── orders.routes.js
 │   │   ├── trades.routes.js
 │   │   └── portfolio.routes.js
 │   ├── controllers
 │   │   ├── instruments.controller.js
 │   │   ├── orders.controller.js
 │   │   ├── trades.controller.js
 │   │   └── portfolio.controller.js
 │   ├── services
 │   │   └── orderExecution.service.js
 │   ├── middlewares
 │   │   └── errorHandler.js
 │   ├── sdk
 │   │   └── tradingSDK.js
 │   └── utils
 │       └── constants.js
 ├── package.json
 └── README.md
```

## 📝 Assumptions Made During Implementation

1. **Single User**: The system operates with a single hardcoded/mock user. Authentication is mocked as per requirements - no real authentication is implemented.

2. **Immediate Execution**: Both MARKET and LIMIT orders execute immediately for simplicity:
   - MARKET orders execute at the instrument's `lastTradedPrice`
   - LIMIT orders execute at the specified price (no validation against current market price)
   - This is a simplified simulation - no real market connectivity or order matching engine

3. **In-Memory Database**: SQLite runs in-memory mode (`:memory:`), meaning all data is reset when the server restarts. This satisfies the requirement for lightweight/in-memory storage.

4. **Static Prices**: Instrument prices are seeded on startup and don't change dynamically. Prices remain constant during the session.

5. **Short Selling**: The system allows selling shares you don't own (short selling), creating negative positions in the portfolio.

6. **Order Execution**: Orders are executed immediately upon placement. There is no order book, queuing, or matching engine - orders execute instantly as a simulation.

7. **Portfolio Calculation**: 
   - Average price is recalculated on each buy (weighted average)
   - Current value = quantity × lastTradedPrice
   - Average price remains unchanged on sells
   - Negative quantities represent short positions

## 🔒 Error Handling

The API implements proper error handling with appropriate HTTP status codes:

**Error Response Format:**
```json
{
  "success": false,
  "error": {
    "message": "Error description here"
  }
}
```

**HTTP Status Codes:**
- `200` - Success
- `201` - Created (new order/trade)
- `400` - Bad Request (validation error)
- `404` - Not Found (resource not found)
- `500` - Internal Server Error

**Centralized Exception Handling:**
- Custom `AppError` class for operational errors
- Global error handler middleware
- Consistent error response format
- Stack traces included in development mode

## 📊 Logging

Basic logging is implemented:
- Request logging for all incoming requests
- Order placement and execution logs
- Trade execution logs
- Portfolio updates
- Error logging with stack traces

## 🎁 Bonus Features Implemented

### 1. Basic Logging and Centralized Exception Handling ✅
- Centralized error handling middleware (`errorHandler.js`)
- Custom `AppError` class for operational errors
- Request logging for all API calls
- Structured logging in controllers and services
- Error stack traces in development mode

### 2. Swagger / OpenAPI Documentation ✅
Interactive API documentation is available at:
```
http://localhost:3000/api-docs
```

The Swagger UI provides:
- Complete API endpoint documentation
- Request/response schemas with examples
- Try-it-out functionality to test endpoints
- Interactive request builder
- Example requests and responses

OpenAPI 3.0 specification is automatically generated from JSDoc comments in the route files. All endpoints are fully documented with:
- Request parameters and body schemas
- Response schemas with status codes
- Error response formats
- Example values

### 3. Unit Tests for Critical APIs ✅
Unit tests are available for all critical APIs. Run tests using:

```bash
npm test
```

Test coverage includes:
- **Orders API**: 
  - Order placement (MARKET/LIMIT orders)
  - Order validation (required fields, invalid values)
  - Error handling (404, 400 status codes)
  - Get order by ID
  - Get all orders
- **Instruments API**: 
  - Fetch all instruments
  - Get instrument by symbol (case insensitive)
  - Error handling for non-existent instruments
- **Portfolio API**: 
  - Portfolio retrieval
  - Portfolio structure validation
  - Calculation accuracy after trades
- **Trades API**: 
  - Trade history retrieval
  - Trade filtering by order ID
  - Trade structure validation

Tests use Node.js built-in test runner (Node.js 18+) and Supertest for HTTP assertions.

### 4. Simple Order Execution Simulation Logic ✅
Order execution simulation is implemented in `orderExecution.service.js`:
- **MARKET orders**: Execute immediately at instrument's `lastTradedPrice`
- **LIMIT orders**: Execute immediately at specified price (simplified simulation)
- Transaction-based execution for atomicity
- Automatic portfolio updates after execution
- Trade record creation
- Order status updates (NEW → EXECUTED)

All executions happen synchronously for simplicity, simulating immediate order matching.

## 📄 License

MIT
