export default class Helper2 {

  static defaultService(inst){
    return inst.props.deployment.services[0].name;
  }

  static defaultPort(inst, serviceName){
    return this.portChoices(inst, serviceName)[0];
  }

  static serviceChoices(inst){
    return inst.props.deployment.services.map(s => s.name);
  }

  static portChoices(inst, serviceName){
    serviceName = serviceName || inst.state.choices.service;
    const buns = this.service(inst, serviceName).ports;
    return buns.map(bun => bun.fromPort)
  }

  static service(inst, name){
    return inst.props.deployment.services.find(s =>
      s.name === name
    );
  }

  static defaultOrigin(){
    return "inNamespace";
  }
}
