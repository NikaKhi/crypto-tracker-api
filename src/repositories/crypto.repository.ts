import db from '../database/db';

export class CryptoRepository {
  static findAll() {
    return db.prepare('SELECT * FROM cryptocurrencies').all();
  }

  static findBySymbol(symbol: string) {
    return db.prepare('SELECT * FROM cryptocurrencies WHERE symbol = ?').get(symbol.toUpperCase());
  }

  static create(symbol: string, name: string) {
    const stmt = db.prepare('INSERT INTO cryptocurrencies (symbol, name) VALUES (?, ?)');
    const info = stmt.run(symbol.toUpperCase(), name);
    return this.findById(info.lastInsertRowid as number);
  }

  static findById(id: number) {
    return db.prepare('SELECT * FROM cryptocurrencies WHERE id = ?').get(id);
  }

  static savePrice(cryptoId: number, price: number) {
    const stmt = db.prepare('INSERT INTO price_history (crypto_id, price, timestamp) VALUES (?, ?, ?)');
    stmt.run(cryptoId, price, new Date().toISOString());
  }

  static updateLastUpdated(cryptoId: number) {
    const stmt = db.prepare('UPDATE cryptocurrencies SET last_updated = ? WHERE id = ?');
    stmt.run(new Date().toISOString(), cryptoId);
  }

  static getHistory(cryptoId: number) {
    return db.prepare('SELECT price, timestamp FROM price_history WHERE crypto_id = ? ORDER BY timestamp DESC').all(cryptoId);
  }

  static delete(id: number) {
    const stmt = db.prepare('DELETE FROM cryptocurrencies WHERE id = ?');
    return stmt.run(id);
  }
}