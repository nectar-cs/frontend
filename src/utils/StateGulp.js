export default class Setter {
  constructor(downstreamSetters = {}, pool = {}){
    this.downstreamOutput = {};
    this.downstreamSetters = downstreamSetters;
    this._pool = pool;
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
    const explicit = this.downstreamSetters[key];
    const pooled = this._pool[key];
    return explicit || pooled;
  }

  assignDown(key = this._key, value = this._value){
    const receiver = this.receiver(key);
    const downBundle = { ...this._bundle, ...this.assignLocal() };
    console.log(`[Setter:assignDown:${this._key}] bun for ${key}`);
    console.log(downBundle);
    return this.invokeReceiver(receiver, key, value, downBundle);
  }

  setOther(key, value){
    console.log(`[Setter:setOther:${key}]`);
    console.log(value);
    const downOutput = this.assignDown(key, value);
    console.log(downOutput);
    this.downstreamOutput = {...this.downstreamOutput, ...downOutput};
  }

  assignLocal(){
    return Setter.defaultReceiver(this._key, this._value);
  }

  produce(){
    const delegate = !!this.downstreamReceiver();
    const asg = delegate ? this.assignDown() : this.assignLocal();
    this.sideEffects({...this._bundle, ...asg});
    console.log(`[Setter:produce:${this._key}] my assg`);
    console.log(asg);
    console.log(`[Setter:produce:${this._key}] side effect asg`);
    console.log(this.downstreamOutput);
    return {...asg, ...this.downstreamOutput}
  }

  sideEffects(){}
  static defaultReceiver = (key, value) => ({ [key]: value });
}