export default class Setter {
  constructor(downstreamSetters = {}){
    this.downstreamOutput = {};
    this.downstreamSetters = downstreamSetters;
  }

  update(key, value, bundle){
    this._bundle = bundle;
    this._value = value;
    this._myAssign = { [key]: value };
    return this;
  }

  downstreamReceiver(key){
    const explicit = this.downstreamSetters[key];
    return explicit || Setter.defaultReceiver;
  }

  assignOther(receiver, key, value){
    const isFunction = receiver instanceof Function;
    if(isFunction) return receiver(key, value);

    const downBundle = { ...this._myAssign, ...this._bundle };
    receiver.update(key, value, downBundle);
    return receiver.produce();
  }

  setOther(key, value){
    const receiver = this.downstreamReceiver(key);
    this.downstreamOutput = {
      ...this.downstreamOutput,
      ...this.assignOther(receiver, key, value)
    };
  }

  produce(){
    this.sideEffects(this._bundle);
    return {...this._myAssign, ...this.downstreamOutput}
  }

  sideEffects(){}
  static defaultReceiver = (key, value) => ({ [key]: value });
}