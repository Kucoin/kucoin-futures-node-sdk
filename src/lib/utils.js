import _ from 'lodash';
import uuid from 'uuid/v4';

export const targetTypesMap = {
    sell: 'asks',
    buy: 'bids',
};

export const keyVersion2 = (version) => {
    return version && version === 2;
};

export const genUUID = (prefix = '')=> {
    return prefix + '__' +uuid();
};

export const mergeDepth = (price, type, depth = 1) => {
    if (type === 'asks') {
        price = Math.ceil(price / depth) * depth;
    } else {
        price = Math.floor(price / depth) * depth;
    }
    return price;
};

export const checkContinue = (arrBuffer = [], seq, seqIndex = 0) => {
    if (arrBuffer.length) {
        if (arrBuffer[0][seqIndex] !== seq +1) {
            return false;
        }
        
        for (let i = 0; i < arrBuffer.length; i++) {
            if (arrBuffer[i + 1] && arrBuffer[i + 1][seqIndex] !== arrBuffer[i][seqIndex] + 1) {
                return false;
            }
        }
    }
    return true;
};

// ----> for level2
export const mapArr = (arr = [], parseKey = (str) => str) => {
    const res = {};
    for (let i = 0; i< arr.length; i++) {
        const item = arr[i];
        res[parseKey(item[0])] = item[1];
    }
    return res;
};

// ----> for level2
export const arrMap = (map = {}, order = 'asc') => {
    const res = [];
    _.each(map, (value, key) => {
        res.push([key, value]);
    });
    res.sort((a, b) => {
        if (order === 'desc') {
            return b[0] - a[0];
        } else {
            return a[0] - b[0];
        }
    });
    return res;
};

// ----> for level3
export const mapl3Arr = (arr = []) => {
    const res = {};
    for (let i = 0; i< arr.length; i++) {
        const item = arr[i];
        res[item[1]] = item; // orderId
    }
    return res;
};

// ----> for level3
export const arrl3Map = (map = {}, side, order = 'asc') => {
    const res = [];
    _.each(map, (item) => {
        // [下单时间, 订单号, 价格, 数量, 进入买卖盘时间]
        const [orderTime, orderId, price, size, ts] = item;
        res.push([mergeDepth(price, side), size, ts, orderId]);
    });
    res.sort((a, b) => {
        if (a[0] === b[0]) {
            // 价格相同的订单以进入买卖盘的时间从低到高排序
            return a[2] - b[2];
        } else {
            // 价格排序
            if (order === 'desc') {
                return b[0] - a[0];
            } else {
                return a[0] - b[0];
            }
        }
    });
    return res;
};
