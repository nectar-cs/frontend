//@flow
import React from 'react'
import {Layout} from 'ui-common';
import LeftHeader from "../../widgets/LeftHeader/LeftHeader";
import Utils from "../../utils/Utils";
import defaults from "./defaults";
import {Types} from "../../types/CommonTypes";
import HowToAnnotate from "./HowToAnnotate";
import ModalButton from "../../widgets/Buttons/ModalButton";
import CommitInfo from "./CommitInfo";
import CenterLoader from "../../widgets/CenterLoader/CenterLoader";
import CenterAnnouncement from "../../widgets/CenterAnnouncement/CenterAnnouncement";
import {ROUTES} from "../../components/Root/RoutesConsts";
import Backend from "../../utils/Backend";
import ImageOpsModal from "../ImageOpsModal/View/ImageOpsModal";

export default class LastCommitModal extends React.Component {

  constructor(props){
    super(props);
    this.state = { isFetching: false, commit: null }
  }

  async componentDidMount(){
    this.fetchCommit();
  }

  render(){
    return(
      <Layout.ModalLayout>
        { this.renderHeader() }
        { this.renderExplainAnnotations() }
        { this.renderCommitInfo() }
        { this.renderNotMatched() }
        { this.renderCommitFetchFailed() }
        { this.renderLoading() }
        { this.renderButton() }
      </Layout.ModalLayout>
    )
  }

  renderHeader(){
    const { deployment, matching } = this.props;
    return(
      <LeftHeader
        graphicName={Utils.msImage(deployment, matching)}
        title={defaults.header.title(deployment.name)}
        subtitle={defaults.header.subtitle}
      />
    )
  }

  renderCommitFetchFailed(){
    if(!this.isMatched() || !this.isAnnotated()) return null;
    if(this.isCommitReady() || this.isFetching()) return null;
    const { sha } = this.props.deployment.commit;
    const { gitRemoteName } = this.props.matching;

    return(
      <CenterAnnouncement
        iconName='sentiment_dissatisfied'
        text={defaults.noFetch.message(gitRemoteName, sha)}
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
    if(!this.isCommitReady()) return null;
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
        callback={() => this.goToImageOps()}
        title={"Deploy from Git..."}
      />
    )
  }

  async fetchCommit(){
    if(this.isMatched() && this.isAnnotated()){
      this.setState(s => ({...s, isFetching: true}));
      const commit = await Backend.bFetch(this.commitAddr());
      this.setState(s => ({...s, commit, isFetching: false}));
    }
  }

  isMatched(): boolean {
    const { matching } = this.props;
    return matching && !!matching.gitRemoteId;
  }

  isAnnotated(): boolean {
    const { deployment } = this.props;
    return deployment && deployment.commit && !!deployment.commit.sha
  }

  isCommitReady(): boolean{
    return !!this.state.commit;
  }

  commitAddr(){
    const { deployment, matching } = this.props;
    return Utils.commitGHPath(deployment.commit, matching);
  }

  isFetching(){ return this.state.isFetching; }

  goToImageOps(){
    const { deployment, matching } = this.props;
    let bundle = { deployment, matching };
    bundle = {...bundle, operationType: 'git'};
    this.props.openModal(ImageOpsModal, bundle);
  }

  static propTypes = {
    deployment: Types.Deployment,
    matching: Types.Matching
  }
}