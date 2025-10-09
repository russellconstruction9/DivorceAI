export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  mode: 'payment' | 'subscription';
}

export const stripeProducts: StripeProduct[] = [
  {
    id: 'prod_TCdl7iz93sLSrW',
    priceId: 'price_1SGEUIFTI9a0AzKUFc18ATqx',
    name: 'CustodyX.AI Pro',
    description: 'Unlock unlimited reports and advanced AI analysis tools to build a comprehensive, court-ready record of your co-parenting experience. Gain deeper insights into behavioral patterns, get help drafting legal documents, and compile complete evidence packages instantly.',
    price: 29.99,
    currency: 'usd',
    mode: 'subscription'
  }
];

export const getProductByPriceId = (priceId: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.priceId === priceId);
};

export const getProductById = (id: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.id === id);
};