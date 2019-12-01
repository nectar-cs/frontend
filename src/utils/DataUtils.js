export default class DataUtils {
  static objWithout(obj, blackKeys) {
    const remainingKeys = Object.keys(obj).filter(key => !blackKeys.includes(key));
    return this.pluck(obj, remainingKeys);
  }

  static pluck(hash, keys) {
    let newHash = {};
    keys.forEach(key => {
      newHash[key] = hash[key];
    });
    return newHash;
  }

  static aToO(array, valueCreator = () => null) {
    const trans = (acc, crt) => ({ ...acc, [crt]: valueCreator(crt) });
    return array.reduce(trans, {});
  }

  static aToH(array) {
    let hash = {};
    array.forEach(el => {
      hash[Object.keys(el)[0]] = Object.values(el)[0];
    });
    return hash;
  }

  static obj2Camel(o) {
    let newO, origKey, newKey, value;
    if (o instanceof Array) {
      return o.map(value => {
        if (typeof value === 'object') {
          value = this.obj2Camel(value);
        }
        return value;
      });
    } else {
      newO = {};
      for (origKey in o) {
        if (o.hasOwnProperty(origKey)) {
          value = o[origKey];
          if (value instanceof Array || (value !== null && value.constructor === Object)) {
            value = this.obj2Camel(value);
          }
          newO[this.snakeStringToCamel(origKey)] = value;
        }
      }
    }
    return newO;
  }

  static obj2Snake(o) {
    let newO, origKey, newKey, value;
    if (o instanceof Array) {
      return o.map(value => {
        if (typeof value === 'object') {
          value = this.obj2Snake(value);
        }
        return value;
      });
    } else {
      newO = {};
      for (origKey in o) {
        if (o.hasOwnProperty(origKey)) {
          value = o[origKey];
          if (value instanceof Array || (value && value.constructor === Object)) {
            value = this.obj2Snake(value);
          }
          newO[this.camelStringToSnake(origKey)] = value;
        }
      }
    }
    return newO;
  }

  static snakeStringToCamel(s) {
    return s.replace(/([-_][a-z])/gi, $1 => {
      return $1
        .toUpperCase()
        .replace('-', '')
        .replace('_', '');
    });
  }

  static camelStringToSnake(s) {
    return s
      .replace(/(?:^|\.?)([A-Z])/g, function(x, y) {
        return '_' + y.toLowerCase();
      })
      .replace(/^_/, '');
  }

  static deepEqual(x, y) {
    const ok = Object.keys,
      tx = typeof x,
      ty = typeof y;
    return x && y && tx === 'object' && tx === ty
      ? ok(x).length === ok(y).length && ok(x).every(key => this.deepEqual(x[key], y[key]))
      : x === y;
  }
}
