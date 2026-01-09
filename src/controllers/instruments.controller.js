import db from "../db/database.js"

export const getAllInstruments = (req, res) => {
  const instruments = db.prepare("SELECT * FROM instruments").all()

  console.log(`📊 Fetched ${instruments.length} instruments`)

  res.json({
    success: true,
    data: instruments,
  })
}

export const getInstrumentBySymbol = (req, res) => {
  const { symbol } = req.params
  const instrument = db.prepare("SELECT * FROM instruments WHERE symbol = ?").get(symbol.toUpperCase())

  if (!instrument) {
    return res.status(404).json({
      success: false,
      error: { message: `Instrument ${symbol} not found` },
    })
  }

  res.json({
    success: true,
    data: instrument,
  })
}
