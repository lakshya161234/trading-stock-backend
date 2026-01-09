/**
 * SDK Demo Script
 * Run this to demonstrate SDK usage: node demo-sdk.js
 */

import TradingSDK from "./src/sdk/tradingSDK.js"

const sdk = new TradingSDK("http://localhost:3000")

async function demo() {
  try {
    console.log("🚀 SDK Demo Started\n")

    // 1. Get all instruments
    console.log("1️⃣  Fetching all instruments...")
    const instruments = await sdk.getInstruments()
    console.log(`   ✅ Found ${instruments.data.length} instruments`)
    console.log(`   Sample: ${instruments.data[0].symbol} - $${instruments.data[0].lastTradedPrice}\n`)

    // 2. Get specific instrument
    console.log("2️⃣  Fetching AAPL details...")
    const aapl = await sdk.getInstrument("AAPL")
    console.log(`   ✅ ${aapl.data.symbol}: $${aapl.data.lastTradedPrice}\n`)

    // 3. Place a MARKET buy order
    console.log("3️⃣  Placing MARKET buy order...")
    const buyOrder = await sdk.buy("AAPL", 10)
    console.log(`   ✅ Order ${buyOrder.data.id} placed and executed`)
    console.log(`   Status: ${buyOrder.data.status}, Price: $${buyOrder.data.price}\n`)

    // 4. Place a LIMIT sell order
    console.log("4️⃣  Placing LIMIT sell order...")
    const sellOrder = await sdk.sell("AAPL", 5, {
      orderType: "LIMIT",
      price: 180.0,
    })
    console.log(`   ✅ Order ${sellOrder.data.id} placed and executed`)
    console.log(`   Status: ${sellOrder.data.status}, Price: $${sellOrder.data.price}\n`)

    // 5. Get order status
    console.log("5️⃣  Fetching order status...")
    const orderStatus = await sdk.getOrderStatus(buyOrder.data.id)
    console.log(`   ✅ Order ${orderStatus.data.id}: ${orderStatus.data.status}\n`)

    // 6. Get all trades
    console.log("6️⃣  Fetching trade history...")
    const trades = await sdk.getTrades()
    console.log(`   ✅ Found ${trades.data.length} trades`)
    if (trades.data.length > 0) {
      const latestTrade = trades.data[0]
      console.log(`   Latest: ${latestTrade.side} ${latestTrade.quantity} ${latestTrade.symbol} @ $${latestTrade.price}\n`)
    }

    // 7. Get portfolio
    console.log("7️⃣  Fetching portfolio...")
    const portfolio = await sdk.getPortfolio()
    console.log(`   ✅ Portfolio Summary:`)
    console.log(`   Total Holdings: ${portfolio.data.summary.totalHoldings}`)
    console.log(`   Total Value: $${portfolio.data.summary.totalValue.toFixed(2)}`)
    console.log(`   Total P&L: $${portfolio.data.summary.totalUnrealizedPnL.toFixed(2)}`)
    console.log(`\n   Holdings:`)
    portfolio.data.holdings.forEach((holding) => {
      console.log(
        `   - ${holding.symbol}: ${holding.quantity} shares @ $${holding.averagePrice.toFixed(2)} avg (Current: $${holding.lastTradedPrice.toFixed(2)})`,
      )
    })

    console.log("\n✅ SDK Demo Completed Successfully!")
  } catch (error) {
    console.error("\n❌ Error:", error.message)
    process.exit(1)
  }
}

// Run demo
demo()
