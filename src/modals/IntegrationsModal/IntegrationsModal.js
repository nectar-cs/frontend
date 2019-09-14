import React, {Fragment} from 'react'
import {LayoutIntro, ModalLayout} from "../../assets/layouts";
import LeftHeader from "../../widgets/LeftHeader/LeftHeader";
import MiscUtils from "../../utils/MiscUtils";
import DockerSection from "./DockerSection";
import GitSection from "./GitSection";
import defaults from "./defaults";
import TextOverLineSubtitle from "../../widgets/TextOverLineSubtitle/TextOverLineSubtitle";
import Backend from "../../utils/Backend";

export default class IntegrationsModal extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      docker: {
        formShowing: false,
        vendor: null
      },
      git: {
        formShowing: true,
        vendor: null
      },
      authUrls: {}
    };

    this.setDockerState = this.setDockerState.bind(this);
    this.setGitState = this.setGitState.bind(this);
  }

  componentDidMount(){
  }

  setDockerState(assignment){
    this.setState(s => ({...s, docker: ({...s.docker, ...assignment})}));
  }

  setGitState(assignment){
    this.setState(s => ({...s, git: ({...s.git, ...assignment})}));
  }

  render(){
    return(
      <ModalLayout>
        <Header/>
        <LayoutIntro>{defaults.intro}</LayoutIntro>
        { this.renderDockerSection() }
        { this.renderGitSection() }
      </ModalLayout>
    )
  }

  renderDockerSection(){
    if(this.state.git.formShowing) return null;
    return(
      <Fragment>
        <TextOverLineSubtitle text='Docker Image Registries'/>
        <DockerSection
          setMasterState={this.setDockerState}
          vendor={this.state.docker.vendor}
          formShowing={this.state.docker.formShowing}
        />
      </Fragment>
    )
  }

  renderGitSection(){
    if(this.state.docker.formShowing) return null;
    return(
      <Fragment>
        <TextOverLineSubtitle text='Git Remotes'/>
        <GitSection
          setMasterState={this.setGitState}
          vendor={this.state.git.vendor}
          formShowing={this.state.git.formShowing}
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
