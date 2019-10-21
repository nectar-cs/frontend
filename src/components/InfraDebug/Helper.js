import Kapi from "../../utils/Kapi";
import DataUtils from "../../utils/DataUtils";
import Backend from "../../utils/Backend";
import S from './DecisionTreeStyles'
import {theme} from "../../assets/constants";

const mult = 120 / 17.8;
const offset = (S.boxDiag / 2) + 2;

export default class Helper{

  static fetchStepMeta(inst, stepId, callback){
    const ep = `/api/analysis/${inst.type()}/step/${stepId}/info`;
    const { deployment, service, port } = inst.state;

    const outPayload = DataUtils.objKeysToSnake({
      depName: deployment.name,
      depNs: deployment.namespace,
      svcName: service,
      fromPort: port
    });

    Kapi.post(ep, outPayload, resp => {
      callback(DataUtils.objKeysToCamel(resp['data']));
    });
  }

  static textLayout(side, text){
    text = text || "";
    const boxWidth = text.length * mult;
    const boxHeight = 30;

    if(side === "top")
      return { x: -boxWidth / 2, y: -boxHeight - 10 };
    else if(side === 'left')
      return { x: -boxWidth - offset, y: -offset };
    else if(side === 'right')
      return { x: offset, y: -offset };
  }

  static decideExpanded(node, crt){
    if(node.isRoot())
      return true;
    if(node.wasProcessed())
      return true;
    return !!node.isCurrent(crt);
  }

  static decideFill(node, crt){
    if(node.isCurrent(crt))  {
      return theme.colors.primaryColor;
    }
  }

  static structToState2(node, crt, side="top"){
    const color = this.decideFill(node, crt);
    const common = {
      key: node.id,
      name: node.title(),
      textLayout: this.textLayout(side, node.title()),
    };

    if(node.isLeaf()){
      return {
        ...common,
        nodeSvgShape: S.leafShape,
      }
    } else {
      return {
        ...common,
        _collapsed: !this.decideExpanded(node, crt),
        nodeSvgShape: S.makeNodeShape(color),
        children: [
          this.structToState2(node.negative, crt, "left"),
          this.structToState2(node.positive, crt, "right")
        ]
      }
    }
  }

  static fetchDeployment(inst){
    const ep = `/api/deployments/${this.depNs(inst)}/${this.depName(inst)}`;
    Kapi.fetch(ep, resp => {
      const deployment = DataUtils.objKeysToCamel(resp);
      inst.update('deployment', deployment);
    });
  }

  static fetchMatching(inst){
    const ep = `/microservices/${this.depNs(inst)}/${this.depName(inst)}`;
    Backend.raisingFetch(ep, resp => {
      const matching = DataUtils.objKeysToCamel(resp)['data'];
      inst.setState(s => ({...s, matching}));
    }, () => inst.setState(s => ({...s, matching: null})));
  }

  static fetchTreeStruct(type, callback){
    const ep = `/api/analysis/${type}/decision_tree`;
    Kapi.fetch(ep, resp => {
      callback(DataUtils.objKeysToCamel(resp['data']));
    });
  }

  static verdictString(value){
    if(value === true) return "not the cause";
    if(value === false) return "problem lies here";
    if(value === null) return "inconclusive";
  }

  static verdictEmotion(value){
    if(value === true) return 'good';
    if(value === false) return 'failure';
    if(value === null) return 'warn2';
  }

  static depName(inst){ return inst.props.match.params['id'] }
  static depNs(inst){ return inst.props.match.params['ns'] }
}