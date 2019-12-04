import Setter from '../../utils/StateGulp';
import Helper from './Helper';

class ResourceTypeSetter extends Setter {
  sideEffects() {
    const resName = this._bundle.getResNames(this._value)[0];
    return { resName };
  }
}

export default class FormGulper {
  constructor() {
    const resType = new ResourceTypeSetter();
    this.masterSetter = new Setter({ resType });
  }

  assign(key, value, inst) {
    const getResNames = type => Helper.resNames(inst, type);
    this.masterSetter.update(key, value, { getResNames });
    return this.masterSetter.produce();
  }
}
