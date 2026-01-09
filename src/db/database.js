import Database from "better-sqlite3"
import { SAMPLE_INSTRUMENTS } from "../utils/constants.js"

const db = new Database(":memory:")

// Enable WAL mode for better performance
db.pragma("journal_mode = WAL")

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS instruments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    symbol TEXT UNIQUE NOT NULL,
    exchange TEXT NOT NULL,
    instrumentType TEXT NOT NULL,
    lastTradedPrice REAL NOT NULL
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    symbol TEXT NOT NULL,
    side TEXT NOT NULL CHECK (side IN ('BUY', 'SELL')),
    orderType TEXT NOT NULL CHECK (orderType IN ('MARKET', 'LIMIT')),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price REAL,
    status TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'PLACED', 'EXECUTED', 'CANCELLED')),
    createdAt TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS trades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orderId INTEGER NOT NULL,
    symbol TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    executedAt TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (orderId) REFERENCES orders(id)
  );

  CREATE TABLE IF NOT EXISTS portfolio (
    symbol TEXT PRIMARY KEY,
    quantity INTEGER NOT NULL DEFAULT 0,
    averagePrice REAL NOT NULL DEFAULT 0
  );
`)

// Seed sample instruments
const insertInstrument = db.prepare(`
  INSERT OR IGNORE INTO instruments (symbol, exchange, instrumentType, lastTradedPrice)
  VALUES (@symbol, @exchange, @instrumentType, @lastTradedPrice)
`)

const seedInstruments = db.transaction((instruments) => {
  for (const instrument of instruments) {
    insertInstrument.run(instrument)
  }
})

seedInstruments(SAMPLE_INSTRUMENTS)
console.log("✅ Database initialized and seeded with sample instruments")

export default db
