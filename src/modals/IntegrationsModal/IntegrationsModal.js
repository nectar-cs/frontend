import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import {Layout, Text} from "ui-common/api/styles";
import LeftHeader from "../../widgets/LeftHeader/LeftHeader";
import DockerSection from "./DockerSection";
import GitSection from "./GitSection";
import defaults from "./defaults";
import TextOverLineSubtitle from "../../widgets/TextOverLineSubtitle/TextOverLineSubtitle";
import PageVisibility from "react-page-visibility";
import ModalButton from "../../widgets/Buttons/ModalButton";

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
    this.onCreateOrDelete = this.onCreateOrDelete.bind(this);
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
        <Layout.ModalLayout>
          <Header/>
          <Text.P>{defaults.intro}</Text.P>
          { this.renderDockerSection() }
          { this.renderGitSection() }
          { this.renderDoneButton() }
        </Layout.ModalLayout>
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
          notifyDataChanged={this.onCreateOrDelete}
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
          notifyDataChanged={this.onCreateOrDelete}
        />
      </Fragment>
    )
  }

  renderDoneButton(){
    const parentCallback = this.props.onDataChanged;
    const callback = () => {
      parentCallback && parentCallback();
      this.props.closeModal();
    };

    return(
      <ModalButton
        callback={callback}
        title={"Done"}
      />
    )
  }

  onCreateOrDelete(){
    if(this.props.onDataChanged)
      this.props.onDataChanged();
  }

  static propTypes = {
    mode: PropTypes.oneOf(['modal', 'embedded']),
    onDataChanged: PropTypes.func,
  };

  static defaultProps = {
    mode: "modal"
  };
}

function Header(){
  return(
    <LeftHeader
      graphicName='extension'
      graphicType='icon'
      title='Docker and Git Setup'
      subtitle='Integration portal'
    />
  )
}
