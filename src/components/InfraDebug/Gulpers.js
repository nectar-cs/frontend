import Setter from "../../utils/StateGulp";
import DataUtils from "../../utils/DataUtils";

class DeploymentSetter extends Setter {
  sideEffects(bundle) {
    console.log("[DepSet:sideEffects] bun: ");
    console.log(bundle);
    console.log("[DepSet:sideEffects] val: ");
    console.log(this._value);
    const firstService = this._value.services[0];
    console.log("[DepSet:sideEffects] svc: ");
    console.log(firstService);
    super.setOther('service', firstService.name);
    console.log("Successful exit ");
  }
}

class ServiceSetter extends Setter {
  sideEffects(bundle) {
    console.log("sidef");
    console.log(bundle);
    const { services } = bundle.deployment;
    const service = services.find(s => s.name === this._value);
    const firstPort = service.ports[0].fromPort;
    super.setOther('port', firstPort);
    console.log("Successful brexit ");
  }
}

class NetworkGulper{
  constructor() {
    const service = new ServiceSetter();
    const deployment = new DeploymentSetter({service});
    this.masterSetter = new Setter({ service, deployment });
  }

  assign(key, value, inst){
    const { deployment } = inst.state;
    const bundle = { deployment };
    console.log("PASSING BUN " + key);
    console.log(bundle);
    console.log(value);
    this.masterSetter.update(key, value, bundle);
    return this.masterSetter.produce();
  }

  genChoices(inst){
    const fields = ['service', 'port'];
    const choices = DataUtils.pluck(inst.state, fields);

    return {
      ...choices,
      serviceChoices: this.serviceChoices(inst),
      portChoices: this.portChoices(inst)
    }
  }

  serviceChoices(inst){
    const { services } = inst.state.deployment;
    return DataUtils.aToH(services.map(s => {
      let summary = `${s.type}: ${s.name} - ${s.internalIp} `;
      return {[s.name]: summary};
    }));
  }

  portChoices(inst){
    const sName = inst.state.service;
    const { services } = inst.state.deployment;
    const service = services.find(s => s.name === sName);
    return DataUtils.aToH(service.ports.map(s => (
      { [s.fromPort]: `${s.toPort} <-- ${s.fromPort}` }
    )));
  }
}

const Gulpers = {
  network: NetworkGulper
};

export default Gulpers;