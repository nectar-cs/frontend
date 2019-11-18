//@flow
import React from 'react'
import LeftHeader from "../../widgets/LeftHeader/LeftHeader";
import defaults from "./defaults";
import FlexibleModal from "../../hocs/FlexibleModal";
import type {Deployment} from "../../types/Types";
import LabelsSection from "./LabelsSection";

export default class OverviewModal extends React.Component<Props>{

  render(){
    return(
      <FlexibleModal mode={this.props.mode}>
        { this.renderHeader() }
        { this.renderLabelsSection() }
      </FlexibleModal>
    )
  }

  renderHeader(){
    const { deployment } = this.props || {};
    return(
      <LeftHeader
        graphicName='assignment'
        graphicType='icon'
        title={defaults.header.title}
        subtitle={defaults.header.subtitle(deployment && deployment.name)}
      />
    )
  }

  renderLabelsSection(){
    const { deployment } = this.props;
    if(!deployment) return null;
    return <LabelsSection deployment={deployment}/>;
  }
}

type Props = {
  deployment: Deployment,
}