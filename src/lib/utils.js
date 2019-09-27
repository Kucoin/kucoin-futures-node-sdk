
import uuid from 'uuid/v4';

export const genUUID = (prefix = '')=> {
    return prefix + '__' +uuid();
}

