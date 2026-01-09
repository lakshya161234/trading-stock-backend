#!/bin/bash

# Demo Commands Script
# Run this script to demonstrate all API endpoints
# Make sure the server is running on http://localhost:3000

BASE_URL="http://localhost:3000/api/v1"

echo "🚀 Trading API Demo"
echo "==================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 1. Health Check
echo -e "${BLUE}1. Health Check${NC}"
curl -s http://localhost:3000/health | jq
echo ""
echo ""

# 2. Get All Instruments
echo -e "${BLUE}2. Get All Instruments${NC}"
curl -s $BASE_URL/instruments | jq '.data[0:3]' # Show first 3
echo ""
echo ""

# 3. Get Specific Instrument
echo -e "${BLUE}3. Get Instrument by Symbol (AAPL)${NC}"
curl -s $BASE_URL/instruments/AAPL | jq
echo ""
echo ""

# 4. Place MARKET Buy Order
echo -e "${BLUE}4. Place MARKET Buy Order (10 shares of AAPL)${NC}"
BUY_ORDER=$(curl -s -X POST $BASE_URL/orders \
  -H "Content-Type: application/json" \
  -d '{"symbol":"AAPL","side":"BUY","orderType":"MARKET","quantity":10}')
echo $BUY_ORDER | jq
ORDER_ID=$(echo $BUY_ORDER | jq -r '.data.id')
echo ""
echo ""

# 5. Place LIMIT Sell Order
echo -e "${BLUE}5. Place LIMIT Sell Order (5 shares of GOOGL at $145)${NC}"
curl -s -X POST $BASE_URL/orders \
  -H "Content-Type: application/json" \
  -d '{"symbol":"GOOGL","side":"SELL","orderType":"LIMIT","quantity":5,"price":145.0}' | jq
echo ""
echo ""

# 6. Get Order Status
echo -e "${BLUE}6. Get Order Status (Order ID: $ORDER_ID)${NC}"
curl -s $BASE_URL/orders/$ORDER_ID | jq
echo ""
echo ""

# 7. Get All Orders
echo -e "${BLUE}7. Get All Orders${NC}"
curl -s $BASE_URL/orders | jq '.data | length' | xargs -I {} echo "Total Orders: {}"
echo ""
echo ""

# 8. Get All Trades
echo -e "${BLUE}8. Get All Trades${NC}"
curl -s $BASE_URL/trades | jq '.data[0:2]' # Show first 2
echo ""
echo ""

# 9. Get Portfolio
echo -e "${BLUE}9. Get Portfolio Holdings${NC}"
curl -s $BASE_URL/portfolio | jq
echo ""
echo ""

# 10. Error Cases
echo -e "${BLUE}10. Error Handling - Missing Required Field${NC}"
curl -s -X POST $BASE_URL/orders \
  -H "Content-Type: application/json" \
  -d '{"symbol":"AAPL"}' | jq
echo ""
echo ""

echo -e "${BLUE}11. Error Handling - Invalid Side${NC}"
curl -s -X POST $BASE_URL/orders \
  -H "Content-Type: application/json" \
  -d '{"symbol":"AAPL","side":"INVALID","orderType":"MARKET","quantity":10}' | jq
echo ""
echo ""

echo -e "${BLUE}12. Error Handling - LIMIT Order Without Price${NC}"
curl -s -X POST $BASE_URL/orders \
  -H "Content-Type: application/json" \
  -d '{"symbol":"AAPL","side":"BUY","orderType":"LIMIT","quantity":10}' | jq
echo ""
echo ""

echo -e "${GREEN}✅ Demo Completed!${NC}"
echo ""
echo "📚 API Documentation: http://localhost:3000/api-docs"
