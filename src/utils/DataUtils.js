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

  static bigHash(array){
    return array.reduce(function(acc, value) {
      acc[value[0]] = value[1];
      return acc;
    }, {});
  }

  static changeHash(hash, transform){
    return Object.keys(hash).reduce((acc, value) => {
      let t = transform(value, hash[value]);
      acc[t[0]] = t[1];
      return acc;
    }, {});
  }

  static blackSpliceArray(array, ...blackKeys){
    return array.map((element) => (
      this.blackSplice(element, blackKeys)
    ));
  }

  static blackSplice(hash, ...blackKeys){
    let whiteKeys = Object.keys(hash).filter((k) => !blackKeys.includes(k));
    return this.whiteSplice(hash, whiteKeys);
  }

  static whiteSplice(hash, ...keys){
    let newHash = {};
    keys.forEach((key) => {newHash[key] = hash[key];});
    return newHash;
  }

  static pick(hash, ...keys) {
    if (!hash || !keys) return;
    var picked = {};
    keys.forEach(prop => {picked[prop] = hash[prop];});
    return picked;
  };

  static isJson(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

}