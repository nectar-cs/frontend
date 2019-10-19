import Setter from "../../utils/StateGulp";
import DataUtils from "../../utils/DataUtils";

class DeploymentSetter extends Setter {
  sideEffects(bundle) {
    const firstService = this._value.services[0];
    return super.assignDown('service', firstService.name);
  }
}

class ServiceSetter extends Setter {
  sideEffects(bundle) {
    const { services } = bundle.deployment;
    const service = services.find(s => s.name === this._value);
    const firstPort = service.ports[0].fromPort;
    return super.assignDown('port', firstPort);
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
    this.masterSetter.update(key, value, bundle);
    return this.masterSetter.produce();
  }

  genChoices(inst){
    const choices = DataUtils.pluck(inst.state, ['service', 'port']);
    const serviceChoices = this.serviceChoices(inst);
    const portChoices = this.portChoices(inst);
    return {...choices, serviceChoices, portChoices };
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