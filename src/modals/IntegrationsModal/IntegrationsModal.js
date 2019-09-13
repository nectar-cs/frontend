import React from 'react'
import {LayoutIntro, ModalLayout} from "../../assets/layouts";
import LeftHeader from "../../widgets/LeftHeader/LeftHeader";
import MiscUtils from "../../utils/MiscUtils";
import DockerSection from "./DockerSection";
import GitSection from "./GitSection";
import defaults from "./defaults";


export default class IntegrationsModal extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      docker: {
        formShowing: false,
        vendor: 'dockerhub'
      }
    };

    this.setDockerState = this.setDockerState.bind(this);
  }

  setDockerState(assignment){
    this.setState(s => ({...s, docker: ({...s.docker, ...assignment})}));
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
    return(
      <DockerSection
        setDockerState={this.setDockerState}
        vendor={this.state.docker.vendor}
        formShowing={this.state.docker.formShowing}
      />
    )
  }

  renderGitSection(){
    if(this.state.docker.formShowing) return null;
    return <GitSection/>
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
