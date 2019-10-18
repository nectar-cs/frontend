import Setter from "../../utils/StateGulp";

class ServiceSetter extends Setter {
  sideEffects() {
    const service = this._bundle.services.find(
      s => s.name === this._value
    );
    const firstPort = service.ports[0].fromPort;
    super.setOther('port', firstPort);
  }
}

class NetworkGulper{
  constructor() {
    this.masterSetter = new Setter({
      service: new ServiceSetter()
    });
  }

  assign(key, value, inst){
    const { deployment } = inst.state;
    const bundle = { deployment };
    this.masterSetter.update(key, value, bundle);
    return this.masterSetter.produce();
  }
}

const Gulpers = {
  network: NetworkGulper
};

export default Gulpers;