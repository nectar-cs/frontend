import Setter from "../../utils/StateGulp";
import DataUtils from "../../utils/DataUtils";

class DeploymentSetter extends Setter {
  sideEffects(bundle) {
    bundle.inst.fetchTree();
    const firstService = this._value.services[0];
    return { service: firstService.name };
  }
}

class ServiceSetter extends Setter {
  sideEffects(bundle) {
    const { services } = bundle.deployment;
    const service = services.find(s => s.name === this._value);
    const firstPort = service.ports[0].fromPort;
    return { port: firstPort }
  }
}

class NodePointerSetter extends Setter{
  sideEffects(bundle) {
    const newNode = this._value;
    bundle.inst.fetchStepMeta(newNode.id(), newNode);
    return {};
  }
}

class NetworkGulper{
  constructor() {
    const service = new ServiceSetter();
    const deployment = new DeploymentSetter({service});
    const crtNodePointer = new NodePointerSetter();
    this.masterSetter = new Setter({
      service,
      deployment,
      crtNodePointer
    });
  }

  assign(key, value, inst){
    const { deployment } = inst.state;
    const bundle = { deployment, inst };
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