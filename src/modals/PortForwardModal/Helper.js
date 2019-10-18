import defaults from "./defaults";

export default class Helper{

  static optionsCache(inst){
    const { deployment } = inst.props;
    const { pods, services } = deployment;
    return {
      deployment: [deployment.name],
      service: services.map(s => s.name),
      pod: pods.map(p => p.name)
    }
  }

  static resNames(inst, resType){
    const type = resType.toLowerCase();
    return this.optionsCache(inst)[type];
  };

  static pastaCommand(inst, choices){
    const source = choices || inst.state.choices;
    const { resType, resName, fromPort } = source;
    return defaults.sectionTwo.command(
      resType.toLowerCase(),
      resName,
      "9000",
      fromPort,
      inst.props.deployment.namespace
    );
  }
}