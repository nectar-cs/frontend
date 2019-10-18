import Kapi from "../../utils/Kapi";
import DataUtils from "../../utils/DataUtils";
import Backend from "../../utils/Backend";
import S from './DecisionTreeStyles'

const mult = 120 / 17;
const offset = (S.boxDiag / 2) + 2;

export default class Helper{

  static depName(inst){ return inst.props.match.params['id'] }
  static depNs(inst){ return inst.props.match.params['ns'] }

  static textLayout(side, text){
    const boxWidth = text.length * mult;
    const boxHeight = 30;

    if(side === "top")
      return { x: -boxWidth / 2, y: -boxHeight - 10 };
    else if(side === 'left')
      return { x: -boxWidth - offset, y: -offset };
    else if(side === 'right')
      return { x: offset, y: -offset };
  }

  static decideExpanded(node){
    if(node.parent.isRoot()){
      return true;
    }
    else return false;
  }

  static structToState2(tree, bun, side="top"){
    const common = {
      key: tree.id,
      name: tree.friendly,
      textLayout: this.textLayout(side, tree.friendly),
    };

    if(!tree.positive && !tree.negative){
      return {
        ...common,
        nodeSvgShape: S.leafShape,
      }
    } else {
      return {
        ...common,
        _collapsed: true,
        nodeSvgShape: S.nodeShape,
        children: [
          this.structToState(tree.negative, bun, "left"),
          this.structToState(tree.positive, bun, "right")
        ]
      }
    }
  }

  static structToState(tree, side="top"){
    const common = {
      key: tree.id,
      name: tree.title,
      textLayout: this.textLayout(side, tree.title),
    };

    if(!tree.positive && !tree.negative){
      return {
        ...common,
        nodeSvgShape: S.leafShape,
      }
    } else {
      return {
        ...common,
        _collapsed: true,
        nodeSvgShape: S.nodeShape,
        children: [
          this.structToState(tree.negative, "left"),
          this.structToState(tree.positive, "right")
        ]
      }
    }
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
    }, () => inst.setState(s => ({...s, matching: null})));
  }

  static fetchTreeStruct(type, callback){
    const ep = `/api/debug/${type}/decision_tree`;
    Kapi.fetch(ep, resp => {
      callback(DataUtils.objKeysToCamel(resp['data']));
    });
  }
}