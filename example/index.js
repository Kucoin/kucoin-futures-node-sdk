const KuCoinFutures = require('../lib/index').default;
// const { v4: uuidV4 } = require('uuid');

const futuresSDK = new KuCoinFutures({
  key: '[Your key]',
  secret: '[Your secret]',
  passphrase: '[Your passphrase]'
});

futuresSDK.futuresTimestamp(console.log);

futuresSDK.futuresStatus(console.log);

// futuresSDK.futuresAccount('USDT', console.log);

// futuresSDK.futuresAccountOverview('USDT', console.log);

// futuresSDK.futuresBuy(
//   {
//     symbol: 'ETHUSDTM',
//     price: 10000,
//     leverage: 5,
//     size: 1,
//     optional: {
//       stop: 'up',
//       stopPriceType: 'TP',
//       stopPrice: '10000'
//     }
//   },
//   console.log
// );

// futuresSDK.futuresBuyTest(
//   {
//     symbol: 'ETHUSDTM',
//     price: 10000,
//     leverage: 5,
//     size: 1,
//     optional: {
//       stop: 'up',
//       stopPriceType: 'TP',
//       stopPrice: '10000'
//     }
//   },
//   console.log
// );

// futuresSDK.futuresSell(
//   {
//     symbol: 'ETHUSDTM',
//     price: 3000,
//     leverage: 15,
//     size: 1,
//     // clientOid: uuidV4(),
//     // optional: {
//     //   remark: 'test',
//     //   stop: 'up',
//     //   stopPriceType: 'TP',
//     //   stopPrice: '20000',
//     //   // ...
//     // }
//   },
//   console.log
// );

// futuresSDK.futuresSellTest(
//   {
//     symbol: 'ETHUSDTM',
//     price: 3000,
//     leverage: 15,
//     size: 1,
//     // clientOid: uuidV4(),
//     optional: {
//       remark: 'test',
//       stop: 'up',
//       stopPriceType: 'TP',
//       stopPrice: '20000',
//       // ...
//     }
//   },
//   console.log
// );

// futuresSDK.futuresCancel('orderId', console.log);

// futuresSDK.futuresCancelAllOpenOrders('ETHUSDTM', console.log);

// futuresSDK.futuresCancelAllStopOrders('ETHUSDTM', console.log);

// futuresSDK.futuresCancelAll('ETHUSDTM', console.log);

// futuresSDK.futuresCancelOrderByClientOid(
//   'ETHUSDTM',
//   'clientId',
//   console.log
// );

// futuresSDK.futuresOpenOrders({ status: 'active' }, (data) =>
//   console.log(JSON.stringify(data))
// );

// futuresSDK.futuresStopOrders({ type: 'market' }, console.log);

// futuresSDK.futuresRecentDoneOrders('', console.log);

// futuresSDK.futuresOrderDetail({ clientOid: 'clientOid' }, console.log);

// futuresSDK.futuresOrderDetail('orderId', console.log);

// futuresSDK.futuresOrderMulti(
//   [
//     {
//       clientOid: uuidV4(),
//       side: 'buy',
//       symbol: 'ETHUSDTM',
//       type: 'limit',
//       price: '10',
//       size: '1',
//       leverage: 5
//     },
//     {
//       clientOid: uuidV4(),
//       side: 'buy',
//       symbol: 'XBTUSDTM',
//       type: 'limit',
//       price: '10',
//       size: '2',
//       leverage: 10
//     }
//   ],
//   console.log
// );

// futuresSDK.futuresMultiCancelOrder({ orderIdsList: ['orderid'] });

// futuresSDK.futuresTransactionHistory(
//   {
//     startTime: new Date().getTime() - 7 * 24 * 60 * 60 * 1000,
//     endTime: new Date().getTime(),
//     type: 'RealisedPNL',
//     maxCount: 100,
//     currency: 'USDT'
//   },
//   console.log
// );

// futuresSDK.futuresSubApi({ subName: '' }, console.log);

// futuresSDK.futuresCreateSubApi(
//   {
//     subName: '',
//     passphrase: '',
//     remark: '',
//   },
//   console.log
// );

// futuresSDK.futureTransferOut(
//   { amount: 0.01, currency: 'USDT', recAccountType: 'MAIN' },
//   console.log
// );

// futuresSDK.futureTransferIn(
//   { amount: 0.01, currency: 'USDT', payAccountType: 'MAIN' },
//   console.log
// );

// futuresSDK.futureTransfers(
//   {
//     startAt: new Date().getTime() - 7 * 24 * 60 * 60 * 1000,
//     endAt: new Date().getTime(),
//     status: 'SUCCESS',
//     currentPage: 1,
//     pageSize: 100,
//     currency: 'USDT'
//   },
//   console.log
// );

// futuresSDK.futuresFills({ pageSize: 100 }, console.log);

// futuresSDK.futuresRecentFills('ETHUSDTM', console.log);

// futuresSDK.futuresRecentFills('', console.log);

// futuresSDK.futuresMarginOpenOrders('ETHUSDTM', console.log);

// futuresSDK.futuresPositionDetail('ETHUSDTM', console.log);

// futuresSDK.futuresPositions('', console.log);

// futuresSDK.futuresPositionAutoDeposit({ symbol: 'ETHUSDTM', status: true }, console.log);

// futuresSDK.futuresPositionAutoDeposit({ symbol: 'ETHUSDTM', status: false }, console.log);

// futuresSDK.futuresPositionMargin(
//   {
//     symbol: 'ETHUSDTM',
//     margin: 0.01
//     // bizNo: uuidV4(),
//   },
//   console.log
// );

// futuresSDK.futuresMaxWithdrawMargin('DOTUSDTM', console.log);

// futuresSDK.futuresWithdrawMargin({ symbol: 'DOTUSDTM', withdrawAmount: '0.009' }, console.log);

// futuresSDK.futuresHistoryPositions({ symbol: 'ETHUSDTM' }, console.log);

// futuresSDK.futuresMaxOpenPositionSize({ symbol: 'ETHUSDTM', price: '2200', leverage: 5 }, console.log);

// futuresSDK.futuresGetMarginMode({ symbol: 'XBTUSDTM' }, console.log);

// futuresSDK.futuresChangeMarginMode({ symbol: 'XBTUSDTM', marginMode: 'CROSS' }, console.log);

// futuresSDK.futuresGetCrossUserLeverage({ symbol: 'XBTUSDTM' }, console.log);

// futuresSDK.futuresChangeCrossUserLeverage({ symbol: 'XBTUSDTM', leverage: '5' }, console.log);

// futuresSDK.futuresRiskLimit('ETHUSDTM', console.log);

// futuresSDK.futuresChangeRiskLimit(
//   { symbol: 'ETHUSDTM', level: 2 },
//   console.log
// );

// futuresSDK.futuresFundingHistory({ symbol: 'ETHUSDTM' }, console.log);

// futuresSDK.futuresMarkPrice('XBTUSDTM', console.log);

// futuresSDK.futuresContractsActive(console.log);

// futuresSDK.futuresContractDetail('XBTUSDTM', console.log);

// futuresSDK.futuresTicker('XBTUSDTM', console.log);

// futuresSDK.futuresAllTicker(console.log);

// futuresSDK.futuresLevel2('XBTUSDTM', console.log);

// futuresSDK.futuresLevel2Depth20('XBTUSDTM', console.log);

// futuresSDK.futuresLevel2Depth100('XBTUSDTM', console.log);

// futuresSDK.futuresTradeHistory('XBTUSDTM', console.log);

// futuresSDK.futuresInterests({ symbol: '.XBTINT' }, console.log);

// futuresSDK.futuresIndexList({ symbol: '.KXBT' }, console.log);

// futuresSDK.futuresMarkPrice('XBTUSDTM', console.log);

// futuresSDK.futuresPremiums({ symbol: '.XBTUSDTMPI' }, console.log);

// futuresSDK.futuresFundingRate('XBTUSDTM', console.log);

// futuresSDK.futuresTradeFees('XBTUSDTM', console.log);

// futuresSDK.futuresKline(
//   {
//     symbol: 'XBTUSDTM',
//     granularity: 480,
//     from: new Date().getTime() - 24 * 60 * 60 * 1000,
//     to: new Date().getTime()
//   },
//   console.log
// );

// futuresSDK.futuresFundingRates({
//   symbol: 'XBTUSDTM',
//   from: '1700310700000',
//   to: '1702310700000',
// }, console.log);

// futuresSDK.futuresTradeStatistics(console.log);

// === websocket === //

// futuresSDK.websocket.klineCandle('XBTUSDTM_15min');

// futuresSDK.websocket.ticker(['ETHUSDTM', 'XBTUSDTM']);

// futuresSDK.websocket.level2(['ETHUSDTM', 'XBTUSDTM']);

// futuresSDK.websocket.execution(['ETHUSDTM', 'XBTUSDTM']);

// futuresSDK.websocket.announcement();

// futuresSDK.websocket.snapshot('ETHUSDTM');

// futuresSDK.websocket.tradeOrders();

// futuresSDK.websocket.advancedOrders();

// futuresSDK.websocket.wallet();

// futuresSDK.websocket.position(['ETHUSDTM', 'LINAUSDTM']);

// futuresSDK.websocket.positionAll();

// futuresSDK.websocket.marginMode();

// futuresSDK.websocket.crossLeverage();