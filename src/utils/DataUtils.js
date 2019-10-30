export default class DataUtils {

  static arrayEquals(array_one, array_two){
    if (!array_two) return false;

    if (array_one.length !== array_two.length)
      return false;

    for (let i = 0, l=array_one.length; i < l; i++) {
      if (array_one[i] instanceof Array && array_two[i] instanceof Array) {
        if (!array_one[i].equals(array_two[i]))
          return false;
      }
      else if (array_one[i] !== array_two[i]) {
        return false;
      }
    }
  }

  static getNestedObject(nestedObj, pathArr){
    return pathArr.reduce((obj, key) =>
      (obj && obj[key] !== 'undefined') ? obj[key] : undefined, nestedObj);
  }

  static blackSplice(hash, ...blackKeys){
    let whiteKeys = Object.keys(hash).filter((k) => !blackKeys.includes(k));
    return this.pluck(hash, whiteKeys);
  }

  static pluck(hash, keys){
    let newHash = {};
    keys.forEach(key => {newHash[key] = hash[key]});
    return newHash;
  }

  static aToO(array, valueCreator=()=>null){
    const trans = (acc, crt) => (
      { ...acc, [crt]: valueCreator(crt) }
    );
    return array.reduce(trans, {});
  }

  static aToH(array){
    let hash = {};
    array.forEach(el => {hash[Object.keys(el)[0]] = Object.values(el)[0];});
    return hash;
  }

  static objKeysToCamel(o) {
    let newO, origKey, newKey, value;
    if (o instanceof Array) {
      return o.map((value) => {
        if (typeof value === "object") {
          value = this.objKeysToCamel(value)
        }
        return value
      })
    } else {
      newO = {};
      for (origKey in o) {
        if (o.hasOwnProperty(origKey)) {
          value = o[origKey];
          if (value instanceof Array || (value !== null && value.constructor === Object)) {
            value = this.objKeysToCamel(value)
          }
          newO[this.snakeStringToCamel(origKey)] = value
        }
      }
    }
    return newO
  }

  static obj2Snake(o) {
    let newO, origKey, newKey, value;
    if (o instanceof Array) {
      return o.map((value) => {
        if (typeof value === "object") {
          value = this.obj2Snake(value)
        }
        return value
      })
    } else {
      newO = {};
      for (origKey in o) {
        if (o.hasOwnProperty(origKey)) {
          value = o[origKey];
          if (value instanceof Array || (value && value.constructor === Object)) {
            value = this.obj2Snake(value)
          }
          newO[this.camelStringToSnake(origKey)] = value
        }
      }
    }
    return newO
  }

  static snakeStringToCamel(s){
    return s.replace(/([-_][a-z])/ig, ($1) => {
      return $1.toUpperCase()
        .replace('-', '')
        .replace('_', '');
    });
  }

  static camelStringToSnake(s){
    return s.replace(/(?:^|\.?)([A-Z])/g,
      function (x,y){return "_" + y.toLowerCase()}).replace(/^_/, ""
    )
  }

}