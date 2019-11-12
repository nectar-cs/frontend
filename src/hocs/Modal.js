import React from 'react'
import FlexibleModal from "./FlexibleModal";
import LeftHeader from "../widgets/LeftHeader/LeftHeader";
import Utils from "../utils/Utils";

export default class Modal extends React.Component{
  render(){
    return(
      <FlexibleModal mode={this.props.mode}>
        { this.renderHeader() }
        { this.renderContent() }
      </FlexibleModal>
    )
  }

  renderHeader(){
    const { deployment, mode } = this.props;
    const defaults = this.defaults();
    return(
      <LeftHeader
        graphicName={Utils.modalImage(this, defaults.header.icon)}
        graphicType={Utils.modalGraphicType(this)}
        title={defaults.header.title(mode, deployment.name)}
        subtitle={defaults.header.subtitle}
      />
    )
  }

  renderContent(){
  }

  defaults(){ return {} }
}