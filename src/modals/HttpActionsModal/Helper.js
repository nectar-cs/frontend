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
}
