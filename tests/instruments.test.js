import { describe, it } from "node:test"
import assert from "node:assert"
import request from "supertest"
import app from "../src/app.js"

describe("Instruments API", () => {
  it("should get all instruments", async () => {
    const response = await request(app)
      .get("/api/v1/instruments")
      .expect(200)

    assert.strictEqual(response.body.success, true)
    assert.ok(Array.isArray(response.body.data))
    assert.ok(response.body.data.length > 0)

    // Check instrument structure
    const instrument = response.body.data[0]
    assert.ok(instrument.id)
    assert.ok(instrument.symbol)
    assert.ok(instrument.exchange)
    assert.ok(instrument.instrumentType)
    assert.ok(typeof instrument.lastTradedPrice === "number")
  })

  it("should get instrument by symbol", async () => {
    const response = await request(app)
      .get("/api/v1/instruments/AAPL")
      .expect(200)

    assert.strictEqual(response.body.success, true)
    assert.strictEqual(response.body.data.symbol, "AAPL")
    assert.ok(response.body.data.exchange)
    assert.ok(response.body.data.instrumentType)
    assert.ok(response.body.data.lastTradedPrice)
  })

  it("should get instrument by symbol (case insensitive)", async () => {
    const response = await request(app)
      .get("/api/v1/instruments/aapl")
      .expect(200)

    assert.strictEqual(response.body.success, true)
    assert.strictEqual(response.body.data.symbol, "AAPL")
  })

  it("should return 404 for non-existent instrument", async () => {
    const response = await request(app)
      .get("/api/v1/instruments/INVALID")
      .expect(404)

    assert.strictEqual(response.body.success, false)
    assert.ok(response.body.error.message.includes("Instrument"))
  })
})
