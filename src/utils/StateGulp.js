export default class Setter {
  constructor(downstreamSetters = {}, pool = {}){
    this.downstreamOutput = {};
    this.downstreamSetters = downstreamSetters;
    this._pool = pool;
    console.log("POOL " + Object.keys(this._pool));
  }

  update(key, value, bundle){
    this._key = key;
    this._bundle = bundle;
    this._value = value;
    console.log("update " + key + " " + value);
    return this;
  }

  receiver(key){
    return this.downstreamReceiver(key) || Setter.defaultReceiver;
  }

  downstreamReceiver(key){
    const explicit = this.downstreamSetters[key];
    const pooled = this._pool[key];
    return explicit || pooled;
  }

  assignDown(key = this._key, value = this._value){
    const receiver = this.receiver(key);
    const downBundle = { ...this._bundle, ...this.assignLocal() };
    console.log(`[Setter:assignDown:${this._key}] bun for ${key}`);
    console.log(downBundle);
    receiver.update(key, value, downBundle);
    return receiver.produce();
  }

  setOther(key, value){
    console.log("setOther " + key + " " + value);
    this.downstreamOutput = {
      ...this.downstreamOutput,
      ...this.assignDown(key, value)
    };
  }

  assignLocal(){
    return Setter.defaultReceiver(this._key, this._value);
  }

  shouldDelegateAssignment(){
    return !!this.downstreamReceiver(this._key)
  }

  produce(){
    this.sideEffects(this._bundle);
    const delegate = this.shouldDelegateAssignment();
    const asg = delegate ? this.assignDown() : this.assignLocal();
    return {...asg, ...this.downstreamOutput}
  }

  sideEffects(){}
  static defaultReceiver = (key, value) => ({ [key]: value });
}