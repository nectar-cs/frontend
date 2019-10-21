import React, {Fragment} from 'react'
import AuthenticatedComponent from "../../hocs/AuthenticatedComponent";
import Layout from "../../assets/layouts";
import OverviewSide from "./OverviewSide";
import CenterLoader from "../../widgets/CenterLoader/CenterLoader";
import Helper from './Helper'
import Node from "./Navigator";
import DebugStep from "./DebugStep";
import Gulpers from "./Gulpers";
import Loader from "../../assets/loading-spinner";

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
        { this.renderActionSide() }
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

  renderActionSide(){
    if(!this.isDataReady()) return null;

    const { options, isStepExecuting } = this.state;
    const formChoices = this.gulper.genChoices(this, options);

    const { isConfigDone } = this.state;
    return(
      <Layout.RightPanel>
        <DebugStep
          type={this.type()}
          node={this.state.crtNodePointer}
          step={this.currentStep()}
          isActive={true}
          isConfigDone={isConfigDone}
          options={formChoices}
          runStepCallback={this.runStep}
          isStepExecuting={isStepExecuting}
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

  fetchStepMeta(stepId, force = false){
    const exists = this.state.steps[stepId];
    if(!(!exists || force)) return null;

    Helper.fetchStepMeta(this, stepId, meta => {
      const steps = {...this.state.steps, [stepId]: meta};
      this.update('steps', steps);
    });
  }

  runStep(){
    const stepId = this.state.crtNodePointer.id();
    this.setState(s => ({...s, isStepExecuting: true}));
    Helper.postRunStep(this, stepId, outcome => {
      this.setState(s => ({...s, isStepExecuting: false}));
      const step = {...this.state.steps[stepId], ...outcome};
      console.log("WE GOT ");
      console.log(outcome);
      const steps = {...this.state.steps, [stepId]: step};
      console.log("MAKING ");
      console.log({...this.state.steps[stepId], ...outcome});

      this.update('steps', steps);
    });
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