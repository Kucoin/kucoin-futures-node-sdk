# Node Helper for KuMEX Strategy
## Usage:    

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
- [ ] Build As SDK

## License

[MIT](LICENSE)
