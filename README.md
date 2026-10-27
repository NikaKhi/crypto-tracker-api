# Crypto Tracker API

Backend service for tracking and aggregating cryptocurrency prices using CoinMarketCap API.

## Features
- Bearer token authentication for API access
- CRUD operations for tracked cryptocurrencies
- Fetching current prices from CoinMarketCap
- Storing price history in SQLite database
- Background job for automatic price updates
- Graceful shutdown for background tasks
- Swagger/OpenAPI documentation

## Tech Stack
- Node.js / TypeScript
- Express.js
- SQLite (better-sqlite3) with raw SQL
- Jest + Supertest (testing)
- Axios
- Swagger (OpenAPI 3.0)

## Getting Started

### Prerequisites
- Node.js 18+
- CoinMarketCap API Key

### Installation
1. Clone the repository
2. Install dependencies:
    ```bash
   npm install
