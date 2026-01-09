import { describe, it, before } from "node:test"
import assert from "node:assert"
import request from "supertest"
import app from "../src/app.js"

describe("Portfolio API", () => {
  before(async () => {
    // Ensure we have some holdings by placing orders
    await request(app)
      .post("/api/v1/orders")
      .send({
        symbol: "AAPL",
        side: "BUY",
        orderType: "MARKET",
        quantity: 10,
      })

    await request(app)
      .post("/api/v1/orders")
      .send({
        symbol: "GOOGL",
        side: "BUY",
        orderType: "MARKET",
        quantity: 5,
      })
  })

  it("should get portfolio holdings", async () => {
    const response = await request(app)
      .get("/api/v1/portfolio")
      .expect(200)

    assert.strictEqual(response.body.success, true)
    assert.ok(response.body.data.holdings)
    assert.ok(response.body.data.summary)
    assert.ok(Array.isArray(response.body.data.holdings))
  })

  it("should have correct portfolio structure", async () => {
    const response = await request(app)
      .get("/api/v1/portfolio")
      .expect(200)

    const holdings = response.body.data.holdings
    if (holdings.length > 0) {
      const holding = holdings[0]
      assert.ok(holding.symbol)
      assert.ok(typeof holding.quantity === "number")
      assert.ok(typeof holding.averagePrice === "number")
      assert.ok(typeof holding.currentValue === "number")
      assert.ok(holding.currentValue >= 0)
    }

    const summary = response.body.data.summary
    assert.ok(typeof summary.totalHoldings === "number")
    assert.ok(typeof summary.totalValue === "number")
    assert.ok(summary.totalValue >= 0)
  })

  it("should calculate portfolio correctly after trades", async () => {
    // Place a buy order
    await request(app)
      .post("/api/v1/orders")
      .send({
        symbol: "MSFT",
        side: "BUY",
        orderType: "MARKET",
        quantity: 2,
      })

    const response = await request(app)
      .get("/api/v1/portfolio")
      .expect(200)

    assert.strictEqual(response.body.success, true)
    
    // Find MSFT holding
    const msftHolding = response.body.data.holdings.find(h => h.symbol === "MSFT")
    if (msftHolding) {
      assert.strictEqual(msftHolding.quantity, 2)
      assert.ok(msftHolding.averagePrice > 0)
      assert.ok(msftHolding.currentValue > 0)
    }
  })
})
