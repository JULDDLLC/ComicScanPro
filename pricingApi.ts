import axios from 'axios';

export interface PricingData {
  title: string;
  issueNumber: string;
  prices: {
    grade: string;
    price: number;
    currency: string;
  }[];
  averagePrice: number;
  lowestPrice: number;
  highestPrice: number;
  lastUpdated: string;
  source: string;
}

// PriceCharting API
const PRICECHARTING_API = 'https://api.pricecharting.com/api/v1';

export async function getPricing(
  title: string,
  issueNumber: string
): Promise<PricingData> {
  try {
    // Search for the comic on PriceCharting
    const searchResponse = await axios.get(`${PRICECHARTING_API}/products`, {
      params: {
        q: `${title} #${issueNumber}`,
        type: 'comic',
      },
    });

    if (!searchResponse.data.products || searchResponse.data.products.length === 0) {
      // Fallback to mock data
      return getMockPricing(title, issueNumber);
    }

    const product = searchResponse.data.products[0];
    const priceResponse = await axios.get(
      `${PRICECHARTING_API}/products/${product.id}/prices`
    );

    const prices = priceResponse.data.prices || [];

    // Map grades to prices
    const gradePrices = [
      { grade: 'Gem Mint (9.8-10)', price: prices.loose?.value || 0 },
      { grade: 'Near Mint (9.0-9.6)', price: (prices.loose?.value || 0) * 0.75 },
      { grade: 'Very Fine (8.0-8.5)', price: (prices.loose?.value || 0) * 0.5 },
      { grade: 'Fine (6.0-7.5)', price: (prices.loose?.value || 0) * 0.3 },
      { grade: 'Very Good (4.0-5.5)', price: (prices.loose?.value || 0) * 0.15 },
    ];

    const validPrices = gradePrices.filter((p) => p.price > 0);
    const averagePrice =
      validPrices.reduce((sum, p) => sum + p.price, 0) / validPrices.length;

    return {
      title,
      issueNumber,
      prices: validPrices.map((p) => ({
        ...p,
        currency: 'USD',
      })),
      averagePrice,
      lowestPrice: Math.min(...validPrices.map((p) => p.price)),
      highestPrice: Math.max(...validPrices.map((p) => p.price)),
      lastUpdated: new Date().toISOString(),
      source: 'PriceCharting',
    };
  } catch (error) {
    console.error('Error fetching pricing:', error);
    return getMockPricing(title, issueNumber);
  }
}

// GoCollect API for real sales data
export async function getPricingFromGoCollect(
  title: string,
  issueNumber: string
): Promise<PricingData> {
  try {
    const response = await axios.get('https://www.gocollect.com/api/search', {
      params: {
        q: `${title} #${issueNumber}`,
      },
    });

    if (!response.data.results || response.data.results.length === 0) {
      return getMockPricing(title, issueNumber);
    }

    const result = response.data.results[0];

    return {
      title,
      issueNumber,
      prices: [
        { grade: 'Gem Mint (9.8-10)', price: result.prices?.mint || 0, currency: 'USD' },
        { grade: 'Near Mint (9.0-9.6)', price: result.prices?.nearMint || 0, currency: 'USD' },
        { grade: 'Very Fine (8.0-8.5)', price: result.prices?.veryFine || 0, currency: 'USD' },
        { grade: 'Fine (6.0-7.5)', price: result.prices?.fine || 0, currency: 'USD' },
      ],
      averagePrice: result.prices?.average || 0,
      lowestPrice: result.prices?.low || 0,
      highestPrice: result.prices?.high || 0,
      lastUpdated: new Date().toISOString(),
      source: 'GoCollect',
    };
  } catch (error) {
    console.error('Error fetching GoCollect pricing:', error);
    return getMockPricing(title, issueNumber);
  }
}

// Mock pricing data for development
function getMockPricing(title: string, issueNumber: string): PricingData {
  const basePrice = Math.random() * 500 + 50;

  return {
    title,
    issueNumber,
    prices: [
      { grade: 'Gem Mint (9.8-10)', price: basePrice, currency: 'USD' },
      { grade: 'Near Mint (9.0-9.6)', price: basePrice * 0.75, currency: 'USD' },
      { grade: 'Very Fine (8.0-8.5)', price: basePrice * 0.5, currency: 'USD' },
      { grade: 'Fine (6.0-7.5)', price: basePrice * 0.3, currency: 'USD' },
      { grade: 'Very Good (4.0-5.5)', price: basePrice * 0.15, currency: 'USD' },
    ],
    averagePrice: basePrice * 0.54,
    lowestPrice: basePrice * 0.15,
    highestPrice: basePrice,
    lastUpdated: new Date().toISOString(),
    source: 'Mock Data',
  };
}

export async function getPriceHistory(
  title: string,
  issueNumber: string,
  days: number = 90
): Promise<{ date: string; price: number }[]> {
  // Mock price history
  const history = [];
  const basePrice = Math.random() * 500 + 50;

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const variance = (Math.random() - 0.5) * basePrice * 0.2;
    history.push({
      date: date.toISOString().split('T')[0],
      price: Math.max(basePrice + variance, 10),
    });
  }

  return history;
}
