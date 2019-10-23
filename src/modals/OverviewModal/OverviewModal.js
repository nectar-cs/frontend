import React from 'react'
import LeftHeader from "../../widgets/LeftHeader/LeftHeader";
import defaults from "./defaults";
import FlexibleModal from "../../hocs/FlexibleModal";

export default class OverviewModal extends React.Component{

  render(){
    return(
      <FlexibleModal mode={this.props.mode}>
        { this.renderHeader() }
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
}