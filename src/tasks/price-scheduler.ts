import { CryptoRepository } from '../repositories/crypto.repository';
import { CoinMarketCapService } from '../services/coinmarketcap.service';

let intervalId: NodeJS.Timeout | null = null;

const updatePrices = async () => {
  try {
    const cryptos = CryptoRepository.findAll() as { id: number; symbol: string }[];
    if (cryptos.length === 0) return;

    const symbols = cryptos.map((c) => c.symbol);
    const prices = await CoinMarketCapService.getPrices(symbols);

    for (const crypto of cryptos) {
      const price = prices[crypto.symbol];
      if (price !== undefined) {
        CryptoRepository.savePrice(crypto.id, price);
        CryptoRepository.updateLastUpdated(crypto.id);
      }
    }
    console.log('Prices updated successfully');
  } catch (error) {
    console.error('Background task error:', error);
  }
};

export const startScheduler = () => {
  updatePrices();
  intervalId = setInterval(updatePrices, 60000);
};

export const stopScheduler = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    console.log('Scheduler stopped');
  }
};