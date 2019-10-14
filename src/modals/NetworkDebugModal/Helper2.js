export default class Helper2 {
  static defaultService(props){
    return props.deployment.services[0].name;
  }

  static serviceChoices(inst){
    return inst.props.deployment.services.map(s => s.name);
  }

  static defaultOrigin(){
    return "inNamespace";
  }
}