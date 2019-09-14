import React, {Fragment} from 'react'
import {LayoutIntro, ModalLayout} from "../../assets/layouts";
import LeftHeader from "../../widgets/LeftHeader/LeftHeader";
import MiscUtils from "../../utils/MiscUtils";
import DockerSection from "./DockerSection";
import GitSection from "./GitSection";
import defaults from "./defaults";
import TextOverLineSubtitle from "../../widgets/TextOverLineSubtitle/TextOverLineSubtitle";
import Backend from "../../utils/Backend";
import PageVisibility from "react-page-visibility";

export default class IntegrationsModal extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      docker: {
        formShowing: false,
        vendor: null
      },
      git: {
        formShowing: false,
        vendor: null
      }
    };

    this.setDockerState = this.setDockerState.bind(this);
    this.setGitState = this.setGitState.bind(this);
    this.gitReloader = null;
    this.imgReloader = null;
  }

  setDockerState(assignment){
    this.setState(s => ({...s, docker: ({...s.docker, ...assignment})}));
  }

  setGitState(assignment){
    this.setState(s => ({...s, git: ({...s.git, ...assignment})}));
  }

  onTabFocusChange = isFocused => {
    if(isFocused){
      this.gitReloader();
      this.imgReloader();
    }
  };

  render(){
    return(
      <PageVisibility onChange={this.onTabFocusChange}>
        <ModalLayout>
          <Header/>
          <LayoutIntro>{defaults.intro}</LayoutIntro>
          { this.renderDockerSection() }
          { this.renderGitSection() }
        </ModalLayout>
      </PageVisibility>
    )
  }

  renderDockerSection(){
    if(this.state.git.formShowing) return null;
    const reloadSetter = (r) => { this.imgReloader = r; };
    return(
      <Fragment>
        <TextOverLineSubtitle text='Docker Image Registries'/>
        <DockerSection
          setMasterState={this.setDockerState}
          vendor={this.state.docker.vendor}
          formShowing={this.state.docker.formShowing}
          setReloadPerformer={reloadSetter}
        />
      </Fragment>
    )
  }

  renderGitSection(){
    if(this.state.docker.formShowing) return null;
    const reloadSetter = (r) => { this.gitReloader = r; };
    return(
      <Fragment>
        <TextOverLineSubtitle text='Git Remotes'/>
        <GitSection
          setMasterState={this.setGitState}
          vendor={this.state.git.vendor}
          formShowing={this.state.git.formShowing}
          setReloadPerformer={reloadSetter}
        />
      </Fragment>
    )
  }
}

function Header(){
  return(
    <LeftHeader
      graphicName={MiscUtils.image('integration.png')}
      title='Docker and Git Setup'
      subtitle='Integration portal'
    />
  )
}
