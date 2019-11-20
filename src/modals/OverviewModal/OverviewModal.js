//@flow
import React, {Fragment} from 'react'
import LeftHeader from "../../widgets/LeftHeader/LeftHeader";
import defaults from "./defaults";
import FlexibleModal from "../../hocs/FlexibleModal";
import type {Deployment} from "../../types/Types";
import LabelsSection from "./LabelsSection";
import Tabs from "../../widgets/Tabs/Tabs";

export default class OverviewModal extends React.Component<Props>{

  render(){
    return(
      <FlexibleModal mode={this.props.mode}>
        { this.renderHeader() }
        { this.renderTabs() }
      </FlexibleModal>
    )
  }

  renderHeader(){
    const { deployment } = this.props || {};
    return(
      <LeftHeader
        graphicName='group_work'
        graphicType='icon'
        title={defaults.header.title}
        subtitle={defaults.header.subtitle(deployment && deployment.name)}
      />
    )
  }

  renderTabs(){
    return(
      <Tabs tabs={defaults.tabsNames} defaultIndex={1}>
        <p>Coming very soon</p>
        { this.renderLabelsSection() }
        <p>Coming very soon</p>
        <p>Coming very soon</p>
        <p>Coming very soon</p>
      </Tabs>
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