interface WalletBalance {
  blockchain: string;
  currency: string;
  amount: number;
}

class Datasource {
  private url: string;
  constructor(url: string) {
      this.url = url;
  }

  async getPrices() {
      try {
          const res = await fetch(this.url);
          const data = await res.json();
          const prices = data.reduce((acc: { [currency: string]: number }, item: { currency: string, date: string, price: number }) => {
              acc[item.currency] = item.price;
              return acc;
          }, {});
          return prices;
      } catch (error) {
          console.error("Error fetching prices:", error);
          return {};
      }
  }
}

const priceApi = "https://interview.switcheo.com/prices.json";

async function testDatasource() {
  const datasource = new Datasource(priceApi);

  try {
    const prices = await datasource.getPrices();
    console.log('Fetched prices:', prices);

  } catch (error) {
    console.error('Error during testDatasource:', error);
  }
}

testDatasource();