import _ from 'lodash';
import uuid from 'uuid/v4';


export const targetTypesMap = {
    sell: 'asks',
    buy: 'bids',
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


export const mapArr = (arr = [], parseKey = (str) => str) => {
    const res = {};
    for (let i = 0; i< arr.length; i++) {
        const item = arr[i];
        res[parseKey(item[0])] = item[1];
    }
    return res;
};

export const arrMap = (map = {}, order = 'asc') => {
    const res = [];
    _.each(map, (size, price) => {
        res.push([price, size]);
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

export const mapl3Arr = (arr = []) => {
    const res = {};
    for (let i = 0; i< arr.length; i++) {
        const item = arr[i];
        res[item[1]] = item; // orderId
    }
    return res;
};
