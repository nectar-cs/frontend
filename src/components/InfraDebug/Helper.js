import Kapi from '../../utils/Kapi';
import DataUtils from '../../utils/DataUtils';
import Backend from '../../utils/Backend';
import S from './DecisionTreeStyles';
import { theme } from '../../assets/constants';

const mult = 120 / 17.8;
const offset = S.boxDiag / 2 + 2;

export default class Helper {
  static stepPayload(inst) {
    const { deployment, service, port } = inst.state;

    return DataUtils.obj2Snake({
      depName: deployment.name,
      depNs: deployment.namespace,
      svcName: service,
      fromPort: port,
    });
  }

  static fetchStepMeta(inst, stepId, callback) {
    const ep = `/api/analysis/${inst.type()}/step/${stepId}/info`;
    Kapi.post(ep, this.stepPayload(inst), resp => {
      callback(DataUtils.obj2Camel(resp['data']));
    });
  }

  static fetchTerminal(inst, stepId, callback) {
    const ep = `/api/analysis/${inst.type()}/terminal/${stepId}/info`;
    Kapi.post(ep, this.stepPayload(inst), resp => {
      callback(DataUtils.obj2Camel(resp['data']));
    });
  }

  static postRunStep(inst, stepId, callback) {
    const ep = `/api/analysis/${inst.type()}/step/${stepId}/run`;
    Kapi.post(ep, this.stepPayload(inst), resp => {
      callback(DataUtils.obj2Camel(resp['data']));
    });
  }

  static textLayout(side, text) {
    text = text || '';
    const boxWidth = text.length * mult;
    const boxHeight = 30;

    if (side === 'top') return { x: -boxWidth / 2, y: -boxHeight - 10 };
    else if (side === 'left') return { x: -boxWidth - offset, y: -offset };
    else if (side === 'right') return { x: offset, y: -offset };
  }

  static decideExpanded(node, crt) {
    if (node.isRoot()) return true;
    if (node.wasProcessed()) return true;
    return !!node.isCurrent(crt);
  }

  static decideNodeFill(node, crt) {
    if (node.isCurrent(crt)) return theme.colors.primaryColor;
    else if (node.wasPositive()) return theme.colors.success;
    else if (node.wasNegative()) return theme.colors.fail;
  }

  static decideLeafFill(node, crt) {
    if (node.isCurrent(crt)) return theme.colors.primaryColor;
    else if (node.wasNegative()) return theme.colors.contrastColor;
  }

  static structToState2(node, crt, side = 'top') {
    const nodeColor = this.decideNodeFill(node, crt);
    const leafColor = this.decideLeafFill(node, crt);

    const common = {
      key: node.id,
      name: node.title(),
      textLayout: this.textLayout(side, node.title()),
    };

    if (node.isLeaf()) {
      return {
        ...common,
        nodeSvgShape: S.makeLeafShape(leafColor),
      };
    } else {
      return {
        ...common,
        _collapsed: !this.decideExpanded(node, crt),
        nodeSvgShape: S.makeNodeShape(nodeColor),
        children: [
          this.structToState2(node.negative, crt, 'left'),
          this.structToState2(node.positive, crt, 'right'),
        ],
      };
    }
  }

  static fetchDeployment(inst) {
    const ep = `/api/deployments/${this.depNs(inst)}/${this.depName(inst)}`;
    Kapi.fetch(ep, resp => {
      const deployment = DataUtils.obj2Camel(resp);
      inst.update('deployment', deployment);
    });
  }

  static fetchMatching(inst) {
    const ep = `/microservices/${this.depName(inst)}`;
    Backend.raisingFetch(
      ep,
      resp => {
        const matching = DataUtils.obj2Camel(resp)['data'];
        inst.setState(s => ({ ...s, matching }));
      },
      () => inst.setState(s => ({ ...s, matching: null })),
    );
  }

  static fetchTreeStruct(type, callback) {
    const ep = `/api/analysis/${type}/decision_tree`;
    Kapi.fetch(ep, resp => {
      callback(DataUtils.obj2Camel(resp['data']));
    });
  }

  static verdictString(value) {
    if (value === 'positive') return 'true - this part works';
    if (value === 'negative') return 'false - this is broken';
  }

  static verdictEmotion(value) {
    if (value === 'positive') return 'good';
    if (value === 'negative') return 'failure';
  }

  static depName(inst) {
    return inst.props.match.params['id'];
  }
  static depNs(inst) {
    return inst.props.match.params['ns'];
  }
}
