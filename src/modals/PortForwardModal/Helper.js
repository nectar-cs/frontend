import defaults from "./defaults";

export default class Helper{

  static assignmentMap = {
    resType: this.setResType,
    resName: this.setResName,
  };

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
      fromPort,
      "9000"
    );
  }

  static applyChoice(inst, key, value){
    const output = Helper.setChoice(inst, key, value);
    inst.setState(s => ({...s, choices: {...s.choices, ...output}}));
  }

  static setChoice(inst, key, value){
    let defSet = () => ({ [key]: value });
    let setter = Helper.assignmentMap[key] || defSet;
    const merger =  setter(inst, value);
    console.log(merger);
    return merger;
  }

  static setResType(inst, resType){
    const resName = Helper.resNames(inst, resType)[0];
    const down = Helper.setResName(inst, resName);
    return {resType, ...down};
  }

  static setResName(inst, resName){
    return {resName};
  }
}