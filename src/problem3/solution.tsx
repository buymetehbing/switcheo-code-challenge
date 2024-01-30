import React, { useEffect, useState, useMemo } from 'react';

const walletApi = "";       // Define walletApi
const priceApi = "https://interview.switcheo.com/prices.json";
const classes = {
    row: "",
};

interface WalletBalance {
    blockchain: string;
    currency: string;
    amount: number;
}

interface FormattedWalletBalance extends WalletBalance {
    formatted: string;
}

interface BoxProps {
    children?: React.ReactNode;
    // Define BoxProps parameters
}

interface Props extends BoxProps {
    // Define Props parameters
}

interface WalletRowProps {
    className: string;
    key: React.Key;
    amount: number;
    usdValue: number;
    formattedAmount: string;
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

    async getBalances() {
        try {
            const res = await fetch(this.url);
            const data = await res.json();
            const balances = data.reduce((acc: WalletBalance[], item: { blockchain: string, currency: string, amount: number }) => {
                const walletBalance: WalletBalance = {
                    blockchain: item.blockchain,
                    currency: item.currency,
                    amount: item.amount,
                  };
                acc.push(walletBalance);
                return acc;
            }, []);
            return balances;
        } catch (error) {
            console.error("Error fetching balances:", error);
            return {};
        }
    }
}

const WalletRow: React.FC<WalletRowProps> = ({ className, key, amount, usdValue, formattedAmount }) => {
    return (
      <div className={className} key={key}>
        <div>Amount: {amount}</div>
        <div>USD Value: {usdValue}</div>
        <div>Formatted Amount: {formattedAmount}</div>
      </div>
    );
};

const WalletPage: React.FC<Props> = (props: Props) => {
    const { children, ...rest } = props;
    const [balances, setBalances] = useState<WalletBalance[]>([]);
    const [prices, setPrices] = useState<{[currency: string]: number}>({});

    useEffect(() => {
        const datasource = new Datasource(walletApi);
        datasource.getBalances().then(balances => {
            setBalances(balances);
        }).catch(error => {
            console.error(error);
        });
    }, []);

    useEffect(() => {
        const datasource = new Datasource(priceApi);
        datasource.getPrices().then(prices => {
            setPrices(prices);
        }).catch(error => {
            console.error(error);
        });
    }, []);

    const getPriority = (blockchain: any): number => {
        switch (blockchain) {
            case 'Osmosis':
            return 100
            case 'Ethereum':
            return 50
            case 'Arbitrum':
            return 30
            case 'Zilliqa':
            return 20
            case 'Neo':
            return 20
            default:
            return -99
        }
    }

    const sortedBalances = useMemo(() => {
        return balances.filter((balance: WalletBalance) => {
            const balancePriority = getPriority(balance.blockchain);
            if (balancePriority > -99 && balance.amount > 0) {
                return true;
            }
            return false;
        }).sort((lhs: WalletBalance, rhs: WalletBalance) => {
            const leftPriority = getPriority(lhs.blockchain);
            const rightPriority = getPriority(rhs.blockchain);
            if (leftPriority > rightPriority) {
                return -1;
            } else if (rightPriority > leftPriority) {
                return 1;
            } 
            return 0;
        });
    }, [balances, prices]);

    const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
        return {
            ...balance,
            formatted: balance.amount.toFixed()
        }
    })

    const rows = formattedBalances.map((balance: FormattedWalletBalance, index: number) => {
        const usdValue = prices[balance.currency] * balance.amount;
        return (
            <WalletRow 
                className={classes.row}
                key={index}
                amount={balance.amount}
                usdValue={usdValue}
                formattedAmount={balance.formatted}
            />
        )
    })

    return (
        <div {...rest}>
            {rows}
        </div>
    )
}