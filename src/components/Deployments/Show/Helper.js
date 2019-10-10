import OverviewSection from "./OverviewSection";
import Kapi from "../../../utils/Kapi";
import DataUtils from "../../../utils/DataUtils";
import Backend from "../../../utils/Backend";
import NetworkDebugSection from "./NetworkDebugSection";

export default class Helper {

  static sectionClasses = [
    OverviewSection,
    NetworkDebugSection
  ];

  static defaultSection = OverviewSection;

  static fetchDeployment(inst){
    inst.setFetch({dep: true});
    const ep = `/api/deployments/${this.depNs(inst)}/${this.depName(inst)}`;
    Kapi.fetch(ep, resp => {
      inst.setFetch({dep: false});
      const deployment = DataUtils.objKeysToCamel(resp);
      inst.setState(s => ({...s, deployment}));
    });
  }

  static fetchMatching(inst){
    inst.setFetch({match: true});
    const ep = `/microservices/${this.depNs(inst)}/${this.depName(inst)}`;
    Backend.raisingFetch(ep, resp => {
      inst.setFetch({match: false});
      const matching = DataUtils.objKeysToCamel(resp)['data'];
      inst.setState(s => ({...s, matching}));
    });
  }

  static depName(inst){ return inst.props.match.params['id'] }
  static depNs(inst){ return inst.props.match.params['ns'] }
}