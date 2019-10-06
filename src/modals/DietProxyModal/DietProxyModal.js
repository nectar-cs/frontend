import React from 'react'
import {Layout} from './../../assets/layouts'
import LeftHeader from "../../widgets/LeftHeader/LeftHeader";
import MiscUtils from "../../utils/MiscUtils";
import defaults from "./defaults";

export default class DietProxyModal extends React.Component{
  render(){
    return(
      <Layout.ModalLayout>
        { this.renderHeader() }
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
}