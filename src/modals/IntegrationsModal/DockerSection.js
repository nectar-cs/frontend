import React from 'react'
import IntegrationSection from "./IntegrationSection";
import Backend from "../../utils/Backend";
import DataUtils from "../../utils/DataUtils";
import defaults from "./defaults";

export default class DockerSection extends IntegrationSection {
  performFetch(whenDone){
    Backend.raisingFetch('/image_registries', (resp) => {
      whenDone(DataUtils.objKeysToCamel(resp['data']));
    });
  }

  performConnectionCheck(id, whenDone){
    const ep = `/image_registries/${id}/check_connection`;
    Backend.raisingFetch(ep, resp => {
      whenDone(resp['data']['connected']);
    })
  }

  vendorList(){
    return defaults.imageRegistryVendors;
  }
}