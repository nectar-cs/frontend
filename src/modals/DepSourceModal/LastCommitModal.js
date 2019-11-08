import React from 'react'
import Layout from "../../assets/layouts";
import LeftHeader from "../../widgets/LeftHeader/LeftHeader";
import MiscUtils from "../../utils/MiscUtils";
import defaults from "./defaults";
import {Types} from "../../types/CommonTypes";
import HowToAnnotate from "./HowToAnnotate";
import ModalButton from "../../widgets/Buttons/ModalButton";
import Helper from "./Helper";
import CommitInfo from "./CommitInfo";
import CenterLoader from "../../widgets/CenterLoader/CenterLoader";
import CenterAnnouncement from "../../widgets/CenterAnnouncement/CenterAnnouncement";
import {ROUTES} from "../../containers/RoutesConsts";

export default class LastCommitModal extends React.Component {

  constructor(props){
    super(props);
    this.state = { isFetching: false, commit: null }
  }

  componentDidMount(){
    if(this.isMatched() && this.isAnnotated())
      Helper.fetchCommit(this);
  }

  render(){
    return(
      <Layout.ModalLayout>
        { this.renderHeader() }
        { this.renderExplainAnnotations() }
        { this.renderCommitInfo() }
        { this.renderNotMatched() }
        { this.renderLoading() }
        { this.renderButton() }
      </Layout.ModalLayout>
    )
  }

  renderHeader(){
    const { deployment, matching } = this.props;
    return(
      <LeftHeader
        graphicName={MiscUtils.msImage(deployment, matching)}
        title={defaults.header.title(deployment.name)}
        subtitle={defaults.header.subtitle}
      />
    )
  }

  renderNotMatched(){
    if(!this.isAnnotated()) return null;
    if(this.isMatched()) return null;

    return(
      <CenterAnnouncement
        iconName='extension'
        text={defaults.notMatched.line}
        light={true}
        contentType='nav-link'
        action={ROUTES.bulkMatch.index.path}
      />
    )
  }

  renderExplainAnnotations(){
    if(this.isAnnotated()) return null;

    return(
      <HowToAnnotate deployment={this.props.deployment}/>
    )
  }

  renderCommitInfo(){
    if(!this.isAnnotated()) return null;
    if(!this.isMatched()) return null;
    return <CommitInfo commit={this.state.commit}/>;
  }

  renderLoading(){
    if(!this.state.isFetching)  return null;
    return <CenterLoader/>;
  }

  renderButton(){
    if(this.isAnnotated()) return null;

    return(
      <ModalButton
        callback={() => Helper.goToImageOps(this)}
        title={"Deploy from Git..."}
      />
    )
  }

  isMatched(){ return Helper.isMatched(this.props.matching); }
  isAnnotated(){ return Helper.isAnnotated(this); }

  static propTypes = {
    deployment: Types.Deployment,
    matching: Types.Matching
  }
}