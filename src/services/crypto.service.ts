import { CryptoRepository } from '../repositories/crypto.repository';
import { AppError } from '../errors/AppError';

export class CryptoService {
  static getAll() {
    return CryptoRepository.findAll();
  }

  static add(symbol: string, name: string) {
    const existing = CryptoRepository.findBySymbol(symbol);
    if (existing) {
      throw new AppError('Cryptocurrency is already being tracked', 409);
    }
    return CryptoRepository.create(symbol, name);
  }

  static getHistory(id: number) {
    const crypto = CryptoRepository.findById(id);
    if (!crypto) {
      throw new AppError('Cryptocurrency not found', 404);
    }
    return CryptoRepository.getHistory(id);
  }

  static remove(id: number) {
    const result = CryptoRepository.delete(id);
    if (result.changes === 0) {
      throw new AppError('Cryptocurrency not found', 404);
    }
    return { success: true };
  }
}