import React, {Fragment} from 'react'
import Layout from './../../assets/layouts'
import LeftHeader from "../../widgets/LeftHeader/LeftHeader";
import Utils from "../../utils/Utils";
import defaults from "./defaults";
import TextOverLineSubtitle from "../../widgets/TextOverLineSubtitle/TextOverLineSubtitle";
import PortForwardForm from "./PortForwardForm";
import Helper from "./Helper";
import CopyWizard from "./CopyWizard";
import {Types} from "../../types/CommonTypes";
import FlexibleModal from "../../hocs/FlexibleModal";
import FormGulper from "./FormGulper";

export default class PortForwardModal extends React.Component{

  constructor(props){
    super(props);
    this.formGulper = new FormGulper();
    this.state = Helper.defState(this, emptyState);
    this.formCallback = this.formCallback.bind(this);
    this.formGulper = new FormGulper();
  }

  render(){
    return(
      <FlexibleModal mode={this.props.mode}>
        { this.renderHeader() }
        { this.renderForm() }
        { this.renderPasta() }
      </FlexibleModal>
    )
  }

  renderHeader(){
    const { deployment, mode } = this.props;
    return(
      <LeftHeader
        graphicName={Utils.modalImage(this, "arrow_upward")}
        graphicType={Utils.modalGraphicType(this)}
        title={defaults.header.title(deployment.name, mode)}
        subtitle={defaults.header.subtitle}
      />
    )
  }

  renderForm(){
    const choices = this.state.choices;
    return(
      <Fragment>
        <TextOverLineSubtitle text={defaults.sectionOne.title}/>
        <PortForwardForm
          {...choices}
          resTypeOptions={defaults.sectionOne.resTypes}
          resNameOptions={Helper.resNames(this, choices.resType)}
          notifyFormValueChanged={this.formCallback}
        />
      </Fragment>
    )
  }

  renderPasta(){
    const choices = this.state.choices;
    return(
      <Fragment>
        <TextOverLineSubtitle text={defaults.sectionTwo.title}/>
        <CopyWizard
          command={Helper.pastaCommand(this)}
          fromPort={choices.fromPort}
          toPort={choices.toPort}
        />
      </Fragment>
    )
  }

  formCallback(key, value){
    const changes = this.formGulper.assign(key, value, this);
    this.setState(s => ({...s, choices: {...s.choices, ...changes}}))
  }

  static propTypes = {
    deployment: Types.Deployment,
    matching: Types.Matching
  }
}

const emptyState = {
  choices: {
    resType: '',
    resName: '',
    fromPort: '80',
    toPort: ''
  }
};
