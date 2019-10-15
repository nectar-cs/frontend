export default class StateGulp {

  gulper(key){
    const capped = key.charAt(0).toUpperCase() + key.slice(1);
    const gulperName = `set${capped}`;
    Reflect.get(this, gulperName);
  }

  propagate(key, value, bundle = {}){
    if(this.gulper(key)){

    } else {

    }

  }

  setTest(value){
    return this.propagate('somOther', 2)
  }


}