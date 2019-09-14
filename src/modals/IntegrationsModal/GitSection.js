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
      whenDone(resp['data']['connected']);
    })
  }

  formRenderer(){
    if(this.props.vendor === 'github')
      return <S.FwdNotice>{defaults.gitFwdNotice}</S.FwdNotice>;
    else
      return <S.Apology>Coming soon!</S.Apology>;
  }

  vendorQuestion(){ return defaults.gitVendorQuestion; }
  vendorList(){ return defaults.gitRemoteVendors; }
}