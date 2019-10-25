import React, {Fragment} from 'react'
import AuthenticatedComponent from "../../hocs/AuthenticatedComponent";
import Layout from "../../assets/layouts";
import OverviewSide from "./OverviewSide";
import CenterLoader from "../../widgets/CenterLoader/CenterLoader";
import Helper from './Helper'
import Node from "./Node";
import DebugStep from "./DebugStep";
import Gulpers from "./Gulpers";
import Loader from "../../assets/loading-spinner";
import TerminalStep from "./TerminalStep";

class InfraDebugClass extends React.Component {

  constructor(props) {
    super(props);
    const source = ((props.location || {}).state) || {};
    this.state = {
      deployment: source.deployment,
      matching: source.matching,
      semanticTree: null,
      crtNodePointer: null,
      isConfigDone: true,
      steps: {},
      isStepExecuting: false
    };

    this.update = this.update.bind(this);
    this.beginDebug = this.beginDebug.bind(this);
    this.runStep = this.runStep.bind(this);
    this.nextStep = this.nextStep.bind(this);
    this.currentStep = this.currentStep.bind(this);
    this.gulper = new Gulpers[this.type()]();
  }

  componentDidMount(){
    Helper.fetchDeployment(this);
    Helper.fetchMatching(this);
  }

  render(){
    return(
      <Fragment>
        { this.renderTopLoader() }
        { this.renderLoader() }
        { this.renderOverviewSide() }
        { this.renderDebugStep() }
        { this.renderTerminalStep() }
      </Fragment>
    )
  }

  renderOverviewSide(){
    if(!this.isDataReady()) return null;

    const { deployment, matching, options } = this.state;
    const { semanticTree, crtNodePointer } = this.state;
    const { isConfigDone } = this.state;
    const formChoices = this.gulper.genChoices(this, options);

    return(
      <Layout.LeftPanel>
        <OverviewSide
          type={this.type()}
          deployment={deployment}
          matching={matching}
          semanticTree={semanticTree}
          crtNodePointer={crtNodePointer}
          formChoices={formChoices}
          formCallback={this.update}
          submitCallback={this.beginDebug}
          isConfigDone={isConfigDone}
        />
      </Layout.LeftPanel>
    )
  }

  renderTopLoader(){
    if(!this.state.isStepExecuting) return null;
    return <Loader.TopRightSpinner/>;
  }

  renderDebugStep(){
    const { options, isStepExecuting, crtNodePointer } = this.state;
    if(!crtNodePointer || crtNodePointer.isLeaf()) return null;
    if(!this.isDataReady()) return null;

    const formChoices = this.gulper.genChoices(this, options);

    const { isConfigDone } = this.state;
    return(
      <Layout.RightPanel>
        <DebugStep
          type={this.type()}
          node={crtNodePointer}
          step={this.currentStep()}
          isActive={true}
          hasStarted={isStepExecuting}
          isConfigDone={isConfigDone}
          options={formChoices}
          runStepCallback={this.runStep}
          nextStepCallback={this.nextStep}
          isStepExecuting={isStepExecuting}
        />
      </Layout.RightPanel>
    )
  }

  renderTerminalStep(){
    const { crtNodePointer } = this.state;
    if(!crtNodePointer || !crtNodePointer.isLeaf()) return null;
    const crtStep = this.currentStep();

    return(
      <Layout.RightPanel>
        <TerminalStep
          node={crtNodePointer}
          terminal={crtStep}
        />
      </Layout.RightPanel>
    )
  }

  renderLoader(){
    if(this.isDataReady()) return null;
    return <CenterLoader/>;
  }

  isDataReady(){
    const { deployment, semanticTree } = this.state;
    return !!deployment && !!semanticTree;
  }

  update(key, value){
    const changes = this.gulper.assign(key, value, this);
    this.setState(s => ({...s, ...changes}));
  }

  fetchStepMeta(stepId, node, force = false){
    const exists = this.state.steps[stepId];
    if(!(!exists || force)) return null;
    if(node.isLeaf()){
      Helper.fetchTerminal(this, stepId, meta => {
        const steps = {...this.state.steps, [stepId]: meta};
        this.update('steps', steps);
      });
    } else {
      Helper.fetchStepMeta(this, stepId, meta => {
        const steps = {...this.state.steps, [stepId]: meta};
        this.update('steps', steps);
      });
    }
  }

  runStep(){
    const stepId = this.state.crtNodePointer.id();
    this.setState(s => ({...s, isStepExecuting: true}));
    Helper.postRunStep(this, stepId, outcome => {
      this.setState(s => ({...s, isStepExecuting: false}));
      const step = {...this.state.steps[stepId], ...outcome};
      const steps = {...this.state.steps, [stepId]: step};
      this.update('steps', steps);
    });
  }

  nextStep(){
    const pointer = this.state.crtNodePointer;
    const crtStep = this.state.steps[pointer.id()];
    pointer.outcome = crtStep.result;
    const newPointer = pointer.childForOutcome();
    this.update('crtNodePointer', newPointer);
  }

  fetchTree(){
    Helper.fetchTreeStruct(this.type(), treeStruct => {
      const semanticTree = Node.gulp(treeStruct);
      this.update('crtNodePointer', semanticTree);
      this.update('semanticTree', semanticTree);
    });
  }

  beginDebug(){
    this.update('isConfigDone', true);
  }

  currentStep(){
    const { steps, crtNodePointer } = this.state;
    if(!crtNodePointer) return null;
    return steps[crtNodePointer.id()];
  }

  type() { return this.props.match.params['type']; }
}

const InfraDebug = AuthenticatedComponent.compose(
  InfraDebugClass
);

export default InfraDebug;