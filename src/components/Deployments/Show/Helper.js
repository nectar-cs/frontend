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

export default class Helper {

  static sectionClasses = [
    OverviewSection,
    LoggingSection,
    PortForwardSection,
    InfraDebugSection,
    IntegrationsSection,
    ImageOpsSection,
    HttpOpsSection,
    CommandsSection,
  ];

  static defaultSection = InfraDebugSection;

  static classNameToKey(className){
    const key = className.replace("Section", "");
    return key.charAt(0).toLowerCase() + key.slice(1);
  }

  static defaultActivity(sectionClassName){
    const key = this.classNameToKey(sectionClassName);
    const activities = defaults.sections[key].activities;
    const activityKeys = Object.keys(activities || {});
    return activityKeys[0];
  }

  static fetchDeployment(inst){
    const ep = `/api/deployments/${this.depNs(inst)}/${this.depName(inst)}`;
    Kapi.fetch(ep, resp => {
      const deployment = DataUtils.objKeysToCamel(resp);
      inst.setState(s => ({...s, deployment}));
    });
  }

  static fetchMatching(inst){
    const ep = `/microservices/${this.depNs(inst)}/${this.depName(inst)}`;
    Backend.raisingFetch(ep, resp => {
      const matching = DataUtils.objKeysToCamel(resp)['data'];
      inst.setState(s => ({...s, matching}));
    });
  }

  static depName(inst){ return inst.props.match.params['id'] }
  static depNs(inst){ return inst.props.match.params['ns'] }
}