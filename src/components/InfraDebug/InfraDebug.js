import React, {Fragment} from 'react'
import AuthenticatedComponent from "../../hocs/AuthenticatedComponent";
import Layout from "../../assets/layouts";
import OverviewSide from "./OverviewSide";
import CenterLoader from "../../widgets/CenterLoader/CenterLoader";
import Helper from './Helper'
import Node from "./Navigator";
import DebugStep from "./DebugStep";
import Gulpers from "./Gulpers";

class InfraDebugClass extends React.Component {

  constructor(props) {
    super(props);
    const source = ((props.location || {}).state) || {};
    this.state = {
      options: {},
      deployment: source.deployment,
      matching: source.matching,
      semanticTree: null,
      crtNodePointer: null,
    };

    this.onFormAssignment = this.onFormAssignment.bind(this);
    this.optionsGulper = Gulpers[this.type()];
  }

  componentDidMount(){
    Helper.fetchDeployment(this);
    Helper.fetchMatching(this);
    Helper.fetchTreeStruct(this.type(), treeStruct => {
      const semanticTree = Node.gulp(treeStruct);
      const crtNodePointer = semanticTree;
      this.setState(s => ({...s, semanticTree, crtNodePointer}));
    });
  }

  render(){
    return(
      <Fragment>
        { this.renderLoader() }
        { this.renderOverviewSide() }
        { this.renderActionSide() }
      </Fragment>
    )
  }

  renderOverviewSide(){
    if(!this.isReady()) return null;

    const { deployment, matching } = this.state;
    const { semanticTree, crtNodePointer } = this.state;

    return(
      <Layout.LeftPanel>
        <OverviewSide
          type={this.type()}
          deployment={deployment}
          matching={matching}
          semanticTree={semanticTree}
          crtNodePointer={crtNodePointer}
          formCallback={this.onFormAssignment}
        />
      </Layout.LeftPanel>
    )
  }

  renderActionSide(){
    if(!this.isReady()) return null;
    return(
      <Layout.RightPanel>
        <DebugStep
          type={this.type()}
          node={this.state.crtNodePointer}
        />
      </Layout.RightPanel>
    )
  }

  renderLoader(){
    if(this.isReady()) return null;
    return <CenterLoader/>;
  }

  isReady(){
    const { deployment, semanticTree } = this.state;
    return !!deployment && !!semanticTree;
  }

  onFormAssignment(key, value){
    const options = this.optionsGulper.assign(key, value, this);
    this.setState(s => ({...s, options: {...s.options, ...options}}));
  }

  type() { return this.props.match.params['type']; }
}

const InfraDebug = AuthenticatedComponent.compose(
  InfraDebugClass
);

export default InfraDebug;