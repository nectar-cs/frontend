export default class Setter {
  constructor(downstreamSetters = {}){
    this.downstreamSetters = downstreamSetters;
  }

  update(key, value, bundle){
    this._key = key;
    this._bundle = bundle;
    this._value = value;
    return this;
  }

  receiver(key){
    return this.downstreamReceiver(key) || Setter.defaultReceiver;
  }

  invokeReceiver(receiver, key, value, downBundle){
    const isSimple = receiver instanceof Function;
    if(isSimple) return receiver(key, value);
    receiver.update(key, value, downBundle);
    return receiver.produce();
  }

  downstreamReceiver(key = this._key){
    return this.downstreamSetters[key];
  }

  assignDown(key = this._key, value = this._value){
    const receiver = this.receiver(key);
    const downBundle = { ...this._bundle, ...this.assignLocal() };
    return this.invokeReceiver(receiver, key, value, downBundle);
  }

  assignLocal(){
    return Setter.defaultReceiver(this._key, this._value);
  }

  produce(){
    const delegate = !!this.downstreamReceiver();
    const asg = delegate ? this.assignDown() : this.assignLocal();
    const sideEffsOutput = this.sideEffects({...this._bundle, ...asg});
    return {...asg, ...sideEffsOutput}
  }

  sideEffects(){}
  static defaultReceiver = (key, value) => ({ [key]: value });
}