import React from 'react';
import Backend from '../../utils/Backend';
import DataUtils from '../../utils/DataUtils';
import Utils from '../../utils/Utils';
import defaults from './defaults';
import IntegrationSection from './IntegrationSection';
import { S } from './IntegrationSectionStyles';

export default class GitSection extends IntegrationSection {
  performFetch(whenDone) {
    Backend.raisingFetch('/remotes?entity=git', resp => {
      whenDone(DataUtils.obj2Camel(resp['data']));
    });
  }

  performAuthUrlsFetch(whenDone) {
    const endpoint = `/remotes/auth_url?type=github`;
    Backend.raisingFetch(endpoint, resp => {
      whenDone({ github: resp['auth_url'] });
    });
  }

  formRenderer() {
    super.formSubmit = () => {
      Utils.mp('Integration Create', { type: 'GitHub', entity: 'git' });
      const url = this.state.authUrls[this.props.vendor];
      window.open(url, '_blank');
      super.onSubmitted();
    };

    if (this.props.vendor === 'github') return <S.FwdNotice>{defaults.gitFwdNotice}</S.FwdNotice>;
    return <S.Apology>Coming soon!</S.Apology>;
  }

  vendorQuestion() {
    return defaults.gitVendorQuestion;
  }

  vendorList() {
    return defaults.gitRemoteVendors;
  }

  newEntryCopy() {
    return defaults.addNewGitRemote;
  }
}
