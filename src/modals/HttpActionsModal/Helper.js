import defaults from './defaults';

export default class Helper {
  static previewCommands(inst) {
    const { host, path, verb } = inst.state.destination;
    const { headerText, bodyText } = inst.state;
    const { namespace, labels } = inst.state.source;

    const url = `${host}${path}`;
    let curl = `curl -X ${verb}`;
    if (headerText) curl = `${curl} -H ${headerText}`;

    if (bodyText) curl = `${curl} -d ${bodyText}`;

    curl = `${curl} ${url}`;

    const bundle = {
      curl,
      ns: namespace,
      lbs: labels,
    };

    return defaults.previewCommands(bundle);
  }

  static makeSvcHost(name, domain, port){
    if(!(domain && port)) return null;
    const key = `http://${domain}:${port}`;
    return { value: key,  show: `${key} (Service ${name})`}
  }

  static makePodHost(name, domain){
    if(!domain) return null;
    const key = `http://${domain}`;
    return { value: key, show: `${key} (Pod ${name})`}
  }

}
