/**
 * List out the computational inefficiencies and anti-patterns found in the code block below.
 * 
 * This code block uses
 * 1. ReactJS with TypeScript.
 * 2. Functional components.
 * 3. React Hooks
 * 
 * Implement the Datasource class so that it can retrieve the prices required.
 * You should explicitly state the issues and explain how to improve them.
 * You should also provide a refactored version of the code.
 */

                                                        // missing imports

interface WalletBalance {                               // missing parameter - blockchain
    currency: string;
    amount: number;
}

interface FormattedWalletBalance {
    currency: string;
    amount: number;
    formatted: string;
}
  
class Datasource {
}

interface Props extends BoxProps {                      // missing interface - BoxProps
}                                                       

const WalletPage: React.FC<Props> = (props: Props) => {
    const { children, ...rest } = props;                // unknown children variable,, define in Props or BoxProps
    const balances = useWalletBalances();               // missing function - useWalletBalances(),, possible to use hooks + Datasource maybe
    const [prices, setPrices] = useState({});

    useEffect(() => {
        const datasource = new Datasource("https://interview.switcheo.com/prices.json");
        datasource.getPrices().then(prices => {
            setPrices(prices);
        }).catch(error => {
            console.err(error);                         // syntax error,, console.error not console.err
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
            if (lhsPriority > -99) {                    // wrong variable,, to use balancePriority instead of lhsPriority
                if (balance.amount <= 0) {              // if statements can be simplified,, use &&
                    return true;                        // wrong logic as it is showing -ve balances,, return false here
                }
            }
            return false
        }).sort((lhs: WalletBalance, rhs: WalletBalance) => {
            const leftPriority = getPriority(lhs.blockchain);
            const rightPriority = getPriority(rhs.blockchain);
            if (leftPriority > rightPriority) {         
                return -1;
            } else if (rightPriority > leftPriority) {
                return 1;
            }                                           // no default return for same priority,, return 0 otherwise
        });
    }, [balances, prices]);

    const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
        return {
            ...balance,
            formatted: balance.amount.toFixed()
        }
    })

    const rows = sortedBalances.map(                        // wrong variable,, use formattedBalances instead of sortedBalances
        (balance: FormattedWalletBalance, index: number) => {     
            const usdValue = prices[balance.currency] * balance.amount;
            return (
            <WalletRow                                      // missing component - WalletRow 
                className={classes.row}                     // missing classes variable
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