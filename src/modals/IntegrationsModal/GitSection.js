import React, {Fragment} from 'react'
import TextOverLineSubtitle from "../../widgets/TextOverLineSubtitle/TextOverLineSubtitle";
import AddNew from "../../widgets/AddNew/AddNew";
import defaults from "./defaults";
import IntegrationSection from "./IntegrationSection";
import Backend from "../../utils/Backend";
import DataUtils from "../../utils/DataUtils";

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

  vendorList(){
    return defaults.imageRegistryVendors;
  }

}