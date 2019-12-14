//@flow
export default class Setter {
  constructor(downstreamSetters = {}) {
    this.downstreamSetters = downstreamSetters;
  }

  update(key, value, bundle, defaults = {}): Setter {
    this._key = key;
    this._bundle = bundle;
    this._value = value;
    this._defaults = defaults;
    return this;
  }

  receiver(key) {
    return this.downstreamReceiver(key) || Setter.defaultReceiver;
  }

  invokeReceiver(receiver, key, value, downBundle): { [string]: any } {
    const isSimple = receiver instanceof Function;
    if (isSimple) return receiver(key, value);
    receiver.update(key, value, downBundle, this._defaults);
    return receiver.produce();
  }

  downstreamReceiver(key = this._key) {
    return this.downstreamSetters[key];
  }

  assignDown(key = this._key, value = this._value): { [string]: any } {
    const receiver = this.receiver(key);
    const downBundle = { ...this._bundle, ...this.assignLocal() };
    return this.invokeReceiver(receiver, key, value, downBundle);
  }

  assignLocal(): { [string]: any } {
    return Setter.defaultReceiver(this._key, this._value);
  }

  produce(): { [string]: any } {
    const delegate = !!this.downstreamReceiver();
    const localAssignResult = delegate ? this.assignDown() : this.assignLocal();
    const passDownBundle = { ...this._bundle, ...localAssignResult };
    const sideEffectAssignResult = this.gulpSideEffects(passDownBundle);
    return { ...localAssignResult, ...sideEffectAssignResult };
  }

  gulpSideEffects(bundle): { [string]: any } {
    const rawSideEffects = this.sideEffects(bundle) || {};
    return Object.keys(rawSideEffects).reduce((whole, assignedKey) => {
      const assignedValue = rawSideEffects[assignedKey];
      const revisedValue = this.overrideWithConsumable(assignedKey, assignedValue);
      const finalAssignment = this.assignDown(assignedKey, revisedValue);
      return { ...whole, ...finalAssignment };
    }, {});
  }

  overrideWithConsumable(key, value) {
    if (Object.keys(this._defaults).includes(key)) {
      const overrideValue = this._defaults[key];
      delete this._defaults[key];
      return overrideValue || value;
    }
    return value;
  }

  sideEffects(bundle: { [string]: * }): { [string]: * } {
    return {};
  }

  static defaultReceiver = (key, value) => ({ [key]: value });
}
