import defaults from "./defaults";

export default class Helper{

  static defState(inst, s){
    const defType = defaults.sectionOne.resTypes[0];
    const defs = inst.formGulper.assign("resType", defType, inst);
    return {...s, choices: {...s.choices, ...defs}};
  }

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