import React from 'react'
import defaults from "./defaults";
import IntegrationSection from "./IntegrationSection";
import Backend from "../../utils/Backend";
import DataUtils from "../../utils/DataUtils";
import {S} from './IntegrationSectionStyles'

export default class GitSection extends IntegrationSection {
  performFetch(whenDone){
    Backend.raisingFetch('/git_remotes', (resp) => {
      whenDone(DataUtils.objKeysToCamel(resp['data']));
    });
  }

  performConnectionCheck(id, whenDone){
    const ep = `/git_remotes/${id}/check_connection`;
    Backend.raisingFetch(ep, resp => {
      whenDone(resp['connected']);
    })
  }

  performAuthUrlsFetch(whenDone){
    const endpoint = `/git_remotes/github/auth_url`;
    Backend.raisingFetch(endpoint, resp => {
      whenDone({github: resp['auth_url']});
    });
  }

  performDelete(id, whenDone){
    const endpoint = `/git_remotes/${id}`;
    Backend.raisingDelete(endpoint, whenDone);
  }

  formRenderer(){
    super.formSubmit = () => {
      const url = this.state.authUrls[this.props.vendor];
      window.open(url, "_blank");
      super.onSubmitted();
    };

    if(this.props.vendor === 'github')
      return <S.FwdNotice>{defaults.gitFwdNotice}</S.FwdNotice>;
    else
      return <S.Apology>Coming soon!</S.Apology>;
  }

  vendorQuestion(){ return defaults.gitVendorQuestion; }
  vendorList(){ return defaults.gitRemoteVendors; }
  newEntryCopy() { return defaults.addNewGitRemote }
}