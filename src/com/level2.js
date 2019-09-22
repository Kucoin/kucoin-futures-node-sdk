
import Datafeed from '../lib/datafeed';

// TODO level2 build
class Level2 {
    datafeed;
    symbol;

    constructor(symbol) {
        this.symbol = symbol;
        this.datafeed = new Datafeed();
    }

    listen = () => {
        this.datafeed.connectSocket();
        this.datafeed.onClose(() => {
            console.log('ws closed, status ', datafeed.trustConnected);
        });

        this.datafeed.subscribe(`/contractMarket/level2:${this.symbol}`, (message) => {
            console.log(message.data);
        });
    }
}

export default Level2;