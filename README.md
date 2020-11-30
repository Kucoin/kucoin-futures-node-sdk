# Node Helper for KuCoin Futures Strategy
## Usage As Framework Helper:    

### Clone and Dep

1. git clone
2. yarn install

### Env Config
1. Run Command 
```sh
# create auth config
copy .env.tpl.js .env.js
```
2. edit
```javascript
export default {
	key: '[Your api key]',
	secret: '[Your api secret]',
	passphrase: '[Your api passphrase]'
}
```

### How to run

1. Base Command
```sh
#Sandbox
yarn run dev

#Online
yarn run prod 
```

2. Strategy

Create [appName].js in /app folder, so it won't be tracked by GIT. And `tempate.js` was already created in /app.

3. Run

```sh
# [appName] is your strategy file name
# default is: template
yarn run dev -- [appName]
```


## Usage As SDK:    

### build by self
1. Clone;

2. Build;
```
# install deps
yarn install

# build
yarn run build

# link sdk folder
yarn link
```

### use package
```
# use yarn
yarn add kucoin-futures-node-sdk

# or use npm
npm install kucoin-futures-node-sdk
```

### use SDK
There's an example in the /sdk_example folder.

## TODO

- [x] Datafeed
- [x] Logger
- [x] Ticker
- [x] Level2
- [x] Order
- [x] Orders
- [x] Position
- [x] Account Overview
- [x] Funding Fees
- [x] Time
- [x] Level3
- [x] Build As SDK

## License

[MIT](LICENSE)
