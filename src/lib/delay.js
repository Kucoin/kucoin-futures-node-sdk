import _ from 'lodash';

const delay = (ms = 1000) => {
    return new Promise((resolve) => {
        _.delay(() => {
            resolve();
        }, ms);
    });
};

export default delay;