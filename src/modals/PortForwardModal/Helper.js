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

  static pastaCommand(inst){
    const { resType, resName, fromPort } = inst.state.choices;
    return defaults.sectionTwo.command(
      resType.toLowerCase(),
      resName,
      fromPort,
      "9000"
    );
  }
}