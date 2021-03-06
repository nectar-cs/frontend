import React from 'react';
import defaults from './defaults';
import IntegrationSection from './IntegrationSection';
import Backend from '../../utils/Backend';
import DataUtils from '../../utils/DataUtils';
import { S } from './IntegrationSectionStyles';

export default class GitSection extends IntegrationSection {
  performFetch(whenDone) {
    Backend.aFetch('/remotes?entity=git', resp => {
      whenDone(DataUtils.obj2Camel(resp['data']));
    });
  }

  performAuthUrlsFetch(whenDone) {
    const endpoint = `/remotes/auth_url?type=github`;
    Backend.aFetch(endpoint, resp => {
      whenDone({ github: resp['auth_url'] });
    });
  }

  formRenderer() {
    super.formSubmit = () => {
      const url = this.state.authUrls[this.props.vendor];
      window.open(url, '_blank');
      super.onSubmitted();
    };

    if (this.props.vendor === 'github') {
      return <S.FwdNotice>{defaults.gitFwdNotice}</S.FwdNotice>;
    }
    else return <S.Apology>Coming soon!</S.Apology>;
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
