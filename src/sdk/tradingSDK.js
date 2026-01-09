/**
 * Trading SDK - JavaScript wrapper for the Trading API
 *
 * Usage:
 *   import TradingSDK from './sdk/tradingSDK.js';
 *   const sdk = new TradingSDK('http://localhost:3000');
 *   const instruments = await sdk.getInstruments();
 */

class TradingSDK {
  constructor(baseUrl = "http://localhost:3000") {
    this.baseUrl = baseUrl.replace(/\/$/, "")
    this.apiVersion = "v1"
  }

  /**
   * Internal method to make API requests
   */
  async _request(endpoint, options = {}) {
    const url = `${this.baseUrl}/api/${this.apiVersion}${endpoint}`

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || `HTTP ${response.status}: Request failed`)
      }

      return data
    } catch (error) {
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        throw new Error(`Failed to connect to Trading API at ${this.baseUrl}`)
      }
      throw error
    }
  }

  /**
   * Get all available trading instruments
   * @returns {Promise<{success: boolean, data: Array}>}
   */
  async getInstruments() {
    return this._request("/instruments")
  }

  /**
   * Get a specific instrument by symbol
   * @param {string} symbol - The instrument symbol (e.g., 'AAPL')
   * @returns {Promise<{success: boolean, data: Object}>}
   */
  async getInstrument(symbol) {
    if (!symbol) throw new Error("Symbol is required")
    return this._request(`/instruments/${symbol.toUpperCase()}`)
  }

  /**
   * Place a new order
   * @param {Object} orderPayload - The order details
   * @param {string} orderPayload.symbol - Instrument symbol
   * @param {string} orderPayload.side - 'BUY' or 'SELL'
   * @param {string} orderPayload.orderType - 'MARKET' or 'LIMIT'
   * @param {number} orderPayload.quantity - Number of shares (must be > 0)
   * @param {number} [orderPayload.price] - Price for LIMIT orders
   * @returns {Promise<{success: boolean, data: Object}>}
   */
  async placeOrder(orderPayload) {
    if (!orderPayload) throw new Error("Order payload is required")

    const { symbol, side, orderType, quantity, price } = orderPayload

    // Client-side validation
    if (!symbol) throw new Error("Symbol is required")
    if (!side || !["BUY", "SELL"].includes(side.toUpperCase())) {
      throw new Error("Side must be BUY or SELL")
    }
    if (!orderType || !["MARKET", "LIMIT"].includes(orderType.toUpperCase())) {
      throw new Error("Order type must be MARKET or LIMIT")
    }
    if (!quantity || quantity <= 0) {
      throw new Error("Quantity must be a positive number")
    }
    if (orderType.toUpperCase() === "LIMIT" && (!price || price <= 0)) {
      throw new Error("Price is required for LIMIT orders")
    }

    return this._request("/orders", {
      method: "POST",
      body: JSON.stringify(orderPayload),
    })
  }

  /**
   * Get all orders
   * @returns {Promise<{success: boolean, data: Array}>}
   */
  async getOrders() {
    return this._request("/orders")
  }

  /**
   * Get order status by ID
   * @param {number|string} orderId - The order ID
   * @returns {Promise<{success: boolean, data: Object}>}
   */
  async getOrderStatus(orderId) {
    if (!orderId) throw new Error("Order ID is required")
    return this._request(`/orders/${orderId}`)
  }

  /**
   * Get all executed trades
   * @returns {Promise<{success: boolean, data: Array}>}
   */
  async getTrades() {
    return this._request("/trades")
  }

  /**
   * Get trades for a specific order
   * @param {number|string} orderId - The order ID
   * @returns {Promise<{success: boolean, data: Array}>}
   */
  async getTradesByOrder(orderId) {
    if (!orderId) throw new Error("Order ID is required")
    return this._request(`/trades/order/${orderId}`)
  }

  /**
   * Get current portfolio holdings
   * @returns {Promise<{success: boolean, data: {holdings: Array, summary: Object}}>}
   */
  async getPortfolio() {
    return this._request("/portfolio")
  }

  /**
   * Convenience method: Buy shares
   * @param {string} symbol - Instrument symbol
   * @param {number} quantity - Number of shares
   * @param {Object} [options] - Additional options
   * @param {string} [options.orderType='MARKET'] - Order type
   * @param {number} [options.price] - Price for LIMIT orders
   */
  async buy(symbol, quantity, options = {}) {
    return this.placeOrder({
      symbol,
      quantity,
      side: "BUY",
      orderType: options.orderType || "MARKET",
      price: options.price,
    })
  }

  /**
   * Convenience method: Sell shares
   * @param {string} symbol - Instrument symbol
   * @param {number} quantity - Number of shares
   * @param {Object} [options] - Additional options
   * @param {string} [options.orderType='MARKET'] - Order type
   * @param {number} [options.price] - Price for LIMIT orders
   */
  async sell(symbol, quantity, options = {}) {
    return this.placeOrder({
      symbol,
      quantity,
      side: "SELL",
      orderType: options.orderType || "MARKET",
      price: options.price,
    })
  }
}

export default TradingSDK
