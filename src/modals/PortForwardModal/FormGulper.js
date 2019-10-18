import Setter from "../../utils/StateGulp";

class ResourceTypeSetter extends Setter {
  sideEffects(bundle) {
    const resName = this._bundle.resNames(this._value)[0];
    this.setOther("resName", resName)
  }
}

class FormGulper{
  constructor() {
    this.masterSetter = new Setter({
      resType: new ResourceTypeSetter()
    });
  }

  assign(key, value, inst){
    const resNames = (type) => Helper.resNames(inst, type);
    const bundle = { resNames };
    this.masterSetter.update(key, value, bundle);
    return this.masterSetter.produce();
  }
}
