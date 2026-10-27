import db from './db';

export const initDatabase = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS cryptocurrencies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      symbol TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      last_updated TEXT
    );

    CREATE TABLE IF NOT EXISTS price_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      crypto_id INTEGER NOT NULL,
      price REAL NOT NULL,
      timestamp TEXT NOT NULL,
      FOREIGN KEY (crypto_id) REFERENCES cryptocurrencies(id) ON DELETE CASCADE
    );
  `);
};