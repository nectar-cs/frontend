import Setter from '../../../utils/StateGulp';

class NamespacesSetter extends Setter {
  sideEffects(bundle: { [string]: * }): { [string]: * } {}
}

class LabelsSetter extends Setter {}

export default class Gulper {
  constructor() {
    this.master = new Setter({
      labels: new LabelsSetter(),
      namespaces: new NamespacesSetter(),
    });
  }

  assign(key, value, bundle) {
    this.master.update(key, value, bundle, this.consumable);
    return this.master.produce();
  }
}
