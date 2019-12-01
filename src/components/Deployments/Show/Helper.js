import OverviewSection from './OverviewSection';
import Kapi from '../../../utils/Kapi';
import DataUtils from '../../../utils/DataUtils';
import Backend from '../../../utils/Backend';
import InfraDebugSection from './InfraDebugSection';
import ImageOpsSection from './ImageOpsSection';
import LoggingSection from './LoggingSection';
import CommandsSection from './CommandsSection';
import PortForwardSection from './PortForwardSection';
import HttpOpsSection from './HttpOpsSection';
import HotReloadSection from './HotReloadSection';
import MatchingSection from './MatchingSection';
import type { Deployment, Matching } from '../../../types/Types';

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
    MatchingSection,
  ];

  static defaultSection = OverviewSection._className();

  static classNameToKey(className) {
    const key = className.replace('Section', '');
    return key.charAt(0).toLowerCase() + key.slice(1);
  }

  static async fetchDeployment(namespace: string, name: string): Deployment {
    const depEp = `/api/deployments/${namespace}/${name}`;
    return await Kapi.bFetch(depEp);
  }

  static async fetchMatching(name: string): Matching {
    const matchingEp = `/microservices/${name}`;
    return await Backend.bFetch(matchingEp);
  }
}
