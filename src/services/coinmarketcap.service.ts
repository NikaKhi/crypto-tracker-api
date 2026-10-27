import axios from 'axios';

interface CMCResponse {
  data: {
    [key: string]: {
      quote: {
        USD: {
          price: number;
        };
      };
    };
  };
}

export class CoinMarketCapService {
  private static readonly BASE_URL = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest';

  static async getPrices(symbols: string[]): Promise<Record<string, number>> {
    if (symbols.length === 0) return {};

    try {
      const response = await axios.get<CMCResponse>(this.BASE_URL, {
        headers: {
          'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY,
        },
        params: {
          symbol: symbols.join(','),
          convert: 'USD',
        },
        timeout: 5000,
      });

      const prices: Record<string, number> = {};
      for (const symbol of symbols) {
        if (response.data.data[symbol]) {
          prices[symbol] = response.data.data[symbol].quote.USD.price;
        }
      }
      return prices;
    } catch (error) {
      console.error('Error fetching from CoinMarketCap:', error);
      throw new Error('Failed to fetch prices from CoinMarketCap');
    }
  }
}