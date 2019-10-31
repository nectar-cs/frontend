import OverviewSection from "./OverviewSection";
import Kapi from "../../../utils/Kapi";
import DataUtils from "../../../utils/DataUtils";
import Backend from "../../../utils/Backend";
import InfraDebugSection from "./InfraDebugSection";
import ImageOpsSection from "./ImageOpsSection";
import LoggingSection from "./LoggingSection";
import IntegrationsSection from "./IntegrationsSection";
import CommandsSection from "./CommandsSection";
import PortForwardSection from "./PortForwardSection";
import HttpOpsSection from "./HttpOpsSection";
import defaults from "./defaults";
import HotReloadSection from "./HotReloadSection";

export default class Helper {

  static sectionClasses = [
    OverviewSection,
    ImageOpsSection,
    InfraDebugSection,
    HttpOpsSection,
    CommandsSection,
    PortForwardSection,
    HotReloadSection,
    LoggingSection,
    IntegrationsSection
  ];

  static defaultSection = ImageOpsSection;

  static classNameToKey(className){
    const key = className.replace("Section", "");
    return key.charAt(0).toLowerCase() + key.slice(1);
  }

  static fetchDeployment(inst){
    const ep = `/api/deployments/${this.depNs(inst)}/${this.depName(inst)}`;
    Kapi.fetch(ep, resp => {
      const deployment = DataUtils.obj2Camel(resp);
      inst.setState(s => ({...s, deployment}));
    });
  }

  static fetchMatching(inst){
    const ep = `/microservices/${this.depName(inst)}`;
    Backend.raisingFetch(ep, resp => {
      const matching = DataUtils.obj2Camel(resp)['data'];
      inst.setState(s => ({...s, matching}));
    }, () => inst.setState(s => ({...s, matching: null})));
  }

  static depName(inst){ return inst.props.match.params['id'] }
  static depNs(inst){ return inst.props.match.params['ns'] }
}