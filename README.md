# KuCoin Futures Node SDK

[![KuCoin Futures Node SDK](https://docs.kucoin.com/futures/images/logo_en.svg)](https://docs.kucoin.com/futures/#introduction)
[![Latest Version](https://img.shields.io/github/release/Kucoin/kucoin-futures-node-sdk.svg?style=flat-square)](https://github.com/Kucoin/kucoin-futures-node-sdk/releases)

- [KuCoin Futures Node SDK](#kucoin-futures-node-sdk)
  - [Installation:](#installation)
  - [Usage](#usage)
  - [REST API](#rest-api)
    - [User](#user)
      - [Get Account Overview](#get-account-overview)
      - [Get Transaction History](#get-transaction-history)
      - [Get Sub-Account Futures API List](#get-sub-account-futures-api-list)
      - [Create Futures APIs for Sub-Account](#create-futures-apis-for-sub-account)
      - [Modify Sub-Account Futures APIs](#modify-sub-account-futures-apis)
      - [Delete Sub-Account Futures APIs](#delete-sub-account-futures-apis)
    - [Transfer](#transfer)
      - [Transfer to Main or TRADE Account](#transfer-to-main-or-trade-account)
      - [Transfer to Futures Account](#transfer-to-futures-account)
      - [Get Transfer-Out Request Records](#get-transfer-out-request-records)
    - [Trade](#trade)
      - [Orders](#orders)
      - [Fills](#fills)
      - [Positions](#positions)
      - [Risk Limit Level](#risk-limit-level)
      - [Funding Fees](#funding-fees)
    - [Market Data](#market-data)
      - [Get Open Contract List](#get-open-contract-list)
      - [Get Order Info of the Contract](#get-order-info-of-the-contract)
      - [Get Ticker](#get-ticker)
      - [Get Full Order Book - Level 2](#get-full-order-book---level-2)
      - [Get Part Order Book - Level 2](#get-part-order-book---level-2)
      - [Transaction History](#transaction-history)
      - [Index](#index)
      - [Server Time](#server-time)
      - [Server Status](#server-status)
      - [Get K Line Data of Contract](#get-k-line-data-of-contract)
  - [WebSocket](#websocket)
    - [Public Channels](#public-channels)
    - [Private Channels](#private-channels)
  - [License](#license)


## Installation:

```js
// Install by npm
npm install kucoin-futures-node-sdk


// Install by yarn
yarn add kucoin-futures-node-sdk
```

## Usage

```js
/** Require SDK */
const KuCoinFutures = require('kucoin-futures-node-sdk');
const futuresSDK = new KuCoinFutures({
  key: '', // KC-API-KEY
  secret: '', // API-Secret
  passphrase: '', // KC-API-PASSPHRASE
  axiosProps: { // optional
    env: 'prod', // default prod
    version: '2' // default version 2
  }
});
```

## REST API

### User

#### Get Account Overview

```js
futuresSDK.futuresAccount('XBT', console.log);
```

#### Get Transaction History

```js
futuresSDK.futuresTransactionHistory(
  {
    startTime: new Date().getTime() - 7 * 24 * 60 * 60 * 1000,
    endTime: new Date().getTime(),
    type: 'RealisedPNL',
    maxCount: 100,
    currency: 'XBT'
  },
  console.log
);
```

#### Get Sub-Account Futures API List

```js
futuresSDK.futuresSubApi({ subName: 'testSDK' }, console.log);
```

#### Create Futures APIs for Sub-Account

```js
futuresSDK.futuresCreateSubApi(
  {
    subName: '[subName]',
    passphrase: '[passphrase]',
    remark: '[remark]'
  },
  console.log
);
```

#### Modify Sub-Account Futures APIs

```js
futuresSDK.futuresUpdateSubApi(
  {
    subName: '[subName]',
    passphrase: '[passphrase]',
    apiKey: '[apiKey]'
  },
  console.log
);
```

#### Delete Sub-Account Futures APIs

```js
futuresSDK.futureDeleteSubApi(
  {
    subName: '[subName]',
    passphrase: '[passphrase]',
    apiKey: '[apiKey]'
  },
  console.log
);
```

---

### Transfer

#### Transfer to Main or TRADE Account

```js
futuresSDK.futureTransferOut(
  { amount: 0.01, currency: 'USDT', recAccountType: 'MAIN' },
  console.log
);
```

#### Transfer to Futures Account

```js
futuresSDK.futureTransferIn(
  { amount: 0.01, currency: 'USDT', payAccountType: 'MAIN' },
  console.log
);
```

#### Get Transfer-Out Request Records

```js
futuresSDK.futureTransfers(
  {
    startAt: new Date().getTime() - 7 * 24 * 60 * 60 * 1000,
    endAt: new Date().getTime(),
    status: 'SUCCESS',
    currentPage: 1,
    pageSize: 100,
    currency: 'USDT'
  },
  console.log
);
```

---

### Trade

#### Orders

```js
// Place an Order
// symbol, price, size, leverage = 1,  clientOid = uuidV4(), optional

// Buy Limit Order
futuresSDK.futuresBuy(
  {
    symbol: 'ETHUSDTM',
    price: 10000,
    leverage: 5,
    size: 1
    // clientOid: uuidV4(),
  },
  console.log
);

// Buy Market Order
futuresSDK.futuresBuy(
  {
    symbol: 'ETHUSDTM',
    leverage: 5,
    size: 1
    // clientOid: uuidV4(),
  },
  console.log
);

// Buy Stop Order
futuresSDK.futuresBuy(
  {
    symbol: 'ETHUSDTM',
    price: 10000,
    leverage: 5,
    size: 1,
    // clientOid: uuidV4(),
    optional: {
      stop: 'up',
      stopPriceType: 'TP',
      stopPrice: '10000'
      // ...
    }
  },
  console.log
);

// Sell Order
// futuresSDK.futuresBuy -> futuresSDK.futuresSell
futuresSDK.futuresSell(
  {
    symbol: 'ETHUSDTM',
    price: 20000,
    leverage: 5,
    size: 1
    // clientOid: uuidV4(),
  },
  console.log
);

// Cancel an Order
futuresSDK.futuresCancel('orderId', console.log);

// Cancel All Order for Symbol
// limit order
futuresSDK.futuresCancelAllOpenOrders('ETHUSDTM', console.log);
// stop order
futuresSDK.futuresCancelAllStopOrders('ETHUSDTM', console.log);
// or cancelAll limit/stop order for symbol
futuresSDK.futuresCancelAll('ETHUSDTM', console.log);

// Get Order List
futuresSDK.futuresOpenOrders({ status: 'active' }, console.log);

// Get Untriggered Stop Order List
futuresSDK.futuresStopOrders({ type: 'limit' }, console.log);

// Get List of Orders Completed in 24h
futuresSDK.futuresRecentDoneOrders('ETHUSDTM', console.log);
// Or Search All
futuresSDK.futuresRecentDoneOrders('', console.log);

// Get Details of a Single Order
futuresSDK.futuresOrderDetail({ clientOid: 'clientOid' }, console.log);
// Or By OrderId
futuresSDK.futuresOrderDetail('orderId', console.log);
```

#### Fills

```js
// Get Fills
futuresSDK.futuresFills({ pageSize: 100 }, console.log);

// Recent Fills
futuresSDK.futuresRecentFills('ETHUSDTM', console.log);
// Or Search All
futuresSDK.futuresRecentFills('', console.log);

// Active Order Value Calculation
futuresSDK.futuresMarginOpenOrders('ETHUSDTM', console.log);
```

#### Positions

```js
// Get Position Details
futuresSDK.futuresPositionDetail('ETHUSDTM', console.log);

// Get Position List
futuresSDK.futuresPositions('USDT', console.log);
// Or Search All
futuresSDK.futuresPositions('', console.log);

// Enable of Auto-Deposit Margin
futuresSDK.futuresPositionAutoDeposit(
  { symbol: 'ETHUSDTM', status: true },
  console.log
);
// Disable of Auto-Deposit Margin
futuresSDK.futuresPositionAutoDeposit(
  { symbol: 'ETHUSDTM', status: false },
  console.log
);

// Add Margin Manually
// bizNo default uuidV4()
futuresSDK.futuresPositionMargin(
  {
    symbol: 'ETHUSDTM',
    margin: 0.01
    // bizNo: uuidV4(),
  },
  console.log
);
```

#### Risk Limit Level

```js
// Obtain Futures Risk Limit Level
futuresSDK.futuresRiskLimit('ETHUSDTM', console.log);

// Adjust Risk Limit Level
futuresSDK.futuresChangeRiskLimit(
  { symbol: 'ETHUSDTM', level: 2 },
  console.log
);
```

#### Funding Fees

```js
futuresSDK.futuresFundingHistory({ symbol: 'ETHUSDTM' }, console.log);
```

---

### Market Data

#### Get Open Contract List

```js
futuresSDK.futuresContractsActive(console.log);
```

#### Get Order Info of the Contract

```js
futuresSDK.futuresContractDetail('XBTUSDTM', console.log);
```

#### Get Ticker

```js
futuresSDK.futuresTicker('XBTUSDTM', console.log);
```

#### Get Full Order Book - Level 2

```js
futuresSDK.futuresLevel2('XBTUSDTM', console.log);
```

#### Get Part Order Book - Level 2

```js
// Get Level2 depth20
futuresSDK.futuresLevel2Depth20('XBTUSDTM', console.log);

// Get Level2 depth100
futuresSDK.futuresLevel2Depth100('XBTUSDTM', console.log);
```

#### Transaction History

```js
futuresSDK.futuresTradeHistory('XBTUSDTM', console.log);
```

#### Index

```js
// Get Interest Rate List
futuresSDK.futuresInterests({ symbol: '.XBTINT' }, console.log);

// Get Index List
futuresSDK.futuresIndexList({ symbol: '.KXBT' }, console.log);

// Get Current Mark Price
futuresSDK.futuresMarkPrice('XBTUSDM', console.log);

// Get Premium Index
futuresSDK.futuresPremiums({ symbol: '.XBTUSDMPI' }, console.log);

// Get Current Funding Rate
futuresSDK.futuresFundingRate('XBTUSDM', console.log);
```

#### Server Time

```js
futuresSDK.futuresTimestamp(console.log);
```

#### Server Status

```js
futuresSDK.futuresStatus(console.log);
```

#### Get K Line Data of Contract

```js
futuresSDK.futuresKline(
  {
    symbol: 'XBTUSDTM',
    granularity: 480,
    from: new Date().getTime() - 24 * 60 * 60 * 1000,
    to: new Date().getTime()
  },
  console.log
);
```

---

## WebSocket

- Socket implements 59s heartbeat, disconnection retry mechanism
- When calling the provided websocket.x method, the system will create a corresponding socket connection channel based on public or private, and only one connection will be created for each type
- Parameters pass symbols, support passing arrays, and push symbol messages in the arrays
- When the parameter is an array, the length of the array will be automatically cut according to the length of 90

> All methods that pass symbols support array format
> The first parameter is symbol and the second parameter is callback. When the parameter does not exist, the first parameter is callback

### Public Channels

```js
//
// Get Real-Time Symbol Ticker v2
futuresSDK.websocket.tickerV2(['ETHUSDTM', 'XBTUSDTM'], console.log);
// Or
futuresSDK.websocket.tickerV2('ETHUSDTM', console.log);

// Get Real-Time Symbol Ticker
futuresSDK.websocket.ticker(['ETHUSDTM', 'XBTUSDTM']);

// Level 2 Market Data
futuresSDK.websocket.level2(['ETHUSDTM', 'XBTUSDTM']);

// Execution data
futuresSDK.websocket.execution(['ETHUSDTM', 'XBTUSDTM']);

// Message channel for the 5 best ask/bid full data of Level 2
futuresSDK.websocket.level2Depth5(['ETHUSDTM', 'XBTUSDTM']);

// Message channel for the 50 best ask/bid full data of Level 2
futuresSDK.websocket.level2Depth50(['ETHUSDTM', 'XBTUSDTM']);

// Contract Market Data
// subject --> "mark.index.price" return Mark Price & Index Price
// subject --> "funding.rate" return Funding Rate
futuresSDK.websocket.instrument(['ETHUSDTM', 'XBTUSDTM']);

// Funding Fee Settlement
// subject -->  "funding.begin" return Start Funding Fee Settlement
// subject -->  "funding.end" return End Funding Fee Settlement
futuresSDK.websocket.announcement(console.log);

// Transaction Statistics Timer Event
futuresSDK.websocket.snapshot(['ETHUSDTM', 'XBTUSDTM']);
```

### Private Channels

```js
// Trade Orders - According To The Market
futuresSDK.websocket.tradeOrders(['ETHUSDTM', 'XBTUSDTM'], console.log);
// Or
futuresSDK.websocket.tradeOrders(console.log);

// Stop Order Lifecycle Event
futuresSDK.websocket.advancedOrders(console.log);

// Account Balance Events
// subject --> "orderMargin.change" return Order Margin Event
// subject --> "availableBalance.change" return Available Balance Event
// subject --> "withdrawHold.change" return Withdrawal Amount & Transfer-Out Amount Event
futuresSDK.websocket.wallet(console.log);

// Position Change Events
// subject --> "position.change" return Position Changes Caused Operations
// Position Changes Caused Operations
// -- “marginChange”: margin change;
// -- “positionChange”: position change;
// -- “liquidation”: liquidation;
// -- “autoAppendMarginStatusChange”: auto-deposit-status change;
// -- “adl”: adl;
// Position Changes Caused by Mark Price
// subject --> "position.settlement" return Funding Settlement
futuresSDK.websocket.position(['ETHUSDTM', 'XBTUSDTM']);
```

## License

[MIT](LICENSE)
