export default class Setter {
  constructor(downstreamSetters = {}){
    this.downstreamSetters = downstreamSetters;
  }

  update(key, value, bundle): Setter {
    this._key = key;
    this._bundle = bundle;
    this._value = value;
    return this;
  }

  receiver(key){
    return this.downstreamReceiver(key) || Setter.defaultReceiver;
  }

  invokeReceiver(receiver, key, value, downBundle): { [string]: any }{
    const isSimple = receiver instanceof Function;
    if(isSimple) return receiver(key, value);
    receiver.update(key, value, downBundle);
    return receiver.produce();
  }

  downstreamReceiver(key = this._key){
    return this.downstreamSetters[key];
  }

  assignDown(key = this._key, value = this._value): { [string]: any }{
    const receiver = this.receiver(key);
    const downBundle = { ...this._bundle, ...this.assignLocal() };
    return this.invokeReceiver(receiver, key, value, downBundle);
  }

  assignLocal(): { [string]: any }{
    return Setter.defaultReceiver(this._key, this._value);
  }

  produce(): { [string]: any } {
    const delegate = !!this.downstreamReceiver();
    const localAssignResult = delegate ? this.assignDown() : this.assignLocal();
    const passDownBundle = { ...this._bundle, ...localAssignResult };
    const sideEffectAssignResult = this.gulpSideEffects(passDownBundle);
    return {...localAssignResult, ...sideEffectAssignResult}
  }

  gulpSideEffects(bundle): { [string]: any }{
    const given = this.sideEffects(bundle) || {};
    return Object.keys(given).reduce((whole, key) => (
      { ...whole, ...this.assignDown(key, given[key]) }
    ), {});
  }

  sideEffects(bundle){ return {} }

  static defaultReceiver = (key, value) => ({ [key]: value });
}