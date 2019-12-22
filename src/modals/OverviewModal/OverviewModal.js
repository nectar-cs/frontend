//@flow
import React from 'react';
import defaults from './defaults';
import FlexibleModal from '../../hocs/FlexibleModal';
import type { Deployment } from '../../types/Types';
import LabelsSection from './LabelsSection';
import Tabs from '../../widgets/Tabs/Tabs';
import ComingSoonSection from '../../widgets/ComingSoonSection/ComingSoonSection';
import CheatSheet from '../../widgets/CheatSheet/CheatSheet';
import ServicesSection from './ServicesSection/ServicesSection';
import { LeftHeader } from "@nectar/js-common";

export default class OverviewModal extends React.Component<Props> {
  render() {
    return (
      <FlexibleModal mode={this.props.mode}>
        {this.renderHeader()}
        {this.renderTabs()}
      </FlexibleModal>
    );
  }

  renderHeader() {
    const { deployment } = this.props || {};
    return (
      <LeftHeader
        graphicName="group_work"
        graphicType="icon"
        title={defaults.header.title}
        subtitle={defaults.header.subtitle(deployment && deployment.name)}
      />
    );
  }

  renderTabs() {
    return (
      <Tabs tabs={defaults.tabsNames} defaultIndex={0}>
        {this.renderServicesSection()}
        {this.renderLabelsSection()}
        {this.renderCheatSheetSection()}
        <ComingSoonSection />
        <ComingSoonSection />
      </Tabs>
    );
  }

  renderLabelsSection() {
    const { deployment } = this.props;
    if (!deployment) return null;
    return <LabelsSection deployment={deployment} />;
  }

  renderCheatSheetSection() {
    const { deployment } = this.props;
    if (!deployment) return null;
    return <CheatSheet resourceName="deployment" resource={deployment} />;
  }

  renderServicesSection() {
    const { deployment } = this.props;
    return <ServicesSection deployment={deployment} />;
  }
}

type Props = {
  deployment: Deployment,
};
