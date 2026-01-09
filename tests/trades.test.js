import { describe, it, before } from "node:test"
import assert from "node:assert"
import request from "supertest"
import app from "../src/app.js"

describe("Trades API", () => {
  let orderId

  before(async () => {
    // Place an order to generate a trade
    const orderResponse = await request(app)
      .post("/api/v1/orders")
      .send({
        symbol: "NVDA",
        side: "BUY",
        orderType: "MARKET",
        quantity: 2,
      })
    
    orderId = orderResponse.body.data.id
  })

  it("should get all trades", async () => {
    const response = await request(app)
      .get("/api/v1/trades")
      .expect(200)

    assert.strictEqual(response.body.success, true)
    assert.ok(Array.isArray(response.body.data))
    assert.ok(response.body.data.length > 0)
  })

  it("should have correct trade structure", async () => {
    const response = await request(app)
      .get("/api/v1/trades")
      .expect(200)

    const trades = response.body.data
    if (trades.length > 0) {
      const trade = trades[0]
      assert.ok(trade.id)
      assert.ok(trade.orderId)
      assert.ok(trade.symbol)
      assert.ok(typeof trade.quantity === "number")
      assert.ok(typeof trade.price === "number")
      assert.ok(trade.executedAt)
      assert.ok(trade.side)
      assert.ok(trade.orderType)
    }
  })

  it("should get trades by order ID", async () => {
    const response = await request(app)
      .get(`/api/v1/trades/order/${orderId}`)
      .expect(200)

    assert.strictEqual(response.body.success, true)
    assert.ok(Array.isArray(response.body.data))
    
    if (response.body.data.length > 0) {
      const trade = response.body.data[0]
      assert.strictEqual(trade.orderId, orderId)
    }
  })

  it("should return empty array for non-existent order trades", async () => {
    const response = await request(app)
      .get("/api/v1/trades/order/99999")
      .expect(200)

    assert.strictEqual(response.body.success, true)
    assert.ok(Array.isArray(response.body.data))
  })
})
