import { describe, it, before, after } from "node:test"
import assert from "node:assert"
import request from "supertest"
import app from "../src/app.js"

describe("Orders API", () => {
  before(() => {
    // Ensure database is seeded
    console.log("Setting up test environment")
  })

  after(() => {
    // Clean up if needed
    console.log("Cleaning up test environment")
  })

  it("should place a MARKET buy order successfully", async () => {
    const orderData = {
      symbol: "AAPL",
      side: "BUY",
      orderType: "MARKET",
      quantity: 10,
    }

    const response = await request(app)
      .post("/api/v1/orders")
      .send(orderData)
      .expect(201)

    assert.strictEqual(response.body.success, true)
    assert.strictEqual(response.body.data.symbol, "AAPL")
    assert.strictEqual(response.body.data.side, "BUY")
    assert.strictEqual(response.body.data.orderType, "MARKET")
    assert.strictEqual(response.body.data.quantity, 10)
    assert.strictEqual(response.body.data.status, "EXECUTED")
    assert.ok(response.body.data.id)
    assert.ok(response.body.data.price)
  })

  it("should place a LIMIT buy order successfully", async () => {
    const orderData = {
      symbol: "GOOGL",
      side: "BUY",
      orderType: "LIMIT",
      quantity: 5,
      price: 140.0,
    }

    const response = await request(app)
      .post("/api/v1/orders")
      .send(orderData)
      .expect(201)

    assert.strictEqual(response.body.success, true)
    assert.strictEqual(response.body.data.symbol, "GOOGL")
    assert.strictEqual(response.body.data.side, "BUY")
    assert.strictEqual(response.body.data.orderType, "LIMIT")
    assert.strictEqual(response.body.data.quantity, 5)
    assert.strictEqual(response.body.data.price, 140.0)
    assert.strictEqual(response.body.data.status, "EXECUTED")
  })

  it("should reject order with missing required fields", async () => {
    const orderData = {
      symbol: "AAPL",
      // Missing side, orderType, quantity
    }

    const response = await request(app)
      .post("/api/v1/orders")
      .send(orderData)
      .expect(400)

    assert.strictEqual(response.body.success, false)
    assert.ok(response.body.error.message)
  })

  it("should reject order with invalid side", async () => {
    const orderData = {
      symbol: "AAPL",
      side: "INVALID",
      orderType: "MARKET",
      quantity: 10,
    }

    const response = await request(app)
      .post("/api/v1/orders")
      .send(orderData)
      .expect(400)

    assert.strictEqual(response.body.success, false)
    assert.ok(response.body.error.message.includes("side"))
  })

  it("should reject order with invalid orderType", async () => {
    const orderData = {
      symbol: "AAPL",
      side: "BUY",
      orderType: "INVALID",
      quantity: 10,
    }

    const response = await request(app)
      .post("/api/v1/orders")
      .send(orderData)
      .expect(400)

    assert.strictEqual(response.body.success, false)
    assert.ok(response.body.error.message.includes("orderType"))
  })

  it("should reject LIMIT order without price", async () => {
    const orderData = {
      symbol: "AAPL",
      side: "BUY",
      orderType: "LIMIT",
      quantity: 10,
      // Missing price
    }

    const response = await request(app)
      .post("/api/v1/orders")
      .send(orderData)
      .expect(400)

    assert.strictEqual(response.body.success, false)
    assert.ok(response.body.error.message.includes("price"))
  })

  it("should reject order with non-positive quantity", async () => {
    const orderData = {
      symbol: "AAPL",
      side: "BUY",
      orderType: "MARKET",
      quantity: 0,
    }

    const response = await request(app)
      .post("/api/v1/orders")
      .send(orderData)
      .expect(400)

    assert.strictEqual(response.body.success, false)
    assert.ok(response.body.error.message.includes("quantity"))
  })

  it("should reject order for non-existent instrument", async () => {
    const orderData = {
      symbol: "INVALID",
      side: "BUY",
      orderType: "MARKET",
      quantity: 10,
    }

    const response = await request(app)
      .post("/api/v1/orders")
      .send(orderData)
      .expect(404)

    assert.strictEqual(response.body.success, false)
    assert.ok(response.body.error.message.includes("Instrument"))
  })

  it("should get order by ID", async () => {
    // First place an order
    const orderData = {
      symbol: "MSFT",
      side: "BUY",
      orderType: "MARKET",
      quantity: 3,
    }

    const createResponse = await request(app)
      .post("/api/v1/orders")
      .send(orderData)
      .expect(201)

    const orderId = createResponse.body.data.id

    // Then fetch it
    const getResponse = await request(app)
      .get(`/api/v1/orders/${orderId}`)
      .expect(200)

    assert.strictEqual(getResponse.body.success, true)
    assert.strictEqual(getResponse.body.data.id, orderId)
    assert.strictEqual(getResponse.body.data.symbol, "MSFT")
  })

  it("should return 404 for non-existent order", async () => {
    const response = await request(app)
      .get("/api/v1/orders/99999")
      .expect(404)

    assert.strictEqual(response.body.success, false)
    assert.ok(response.body.error.message.includes("Order"))
  })

  it("should get all orders", async () => {
    const response = await request(app)
      .get("/api/v1/orders")
      .expect(200)

    assert.strictEqual(response.body.success, true)
    assert.ok(Array.isArray(response.body.data))
    assert.ok(response.body.data.length > 0)
  })
})
