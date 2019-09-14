import React from 'react'
import IntegrationSection from "./IntegrationSection";
import Backend from "../../utils/Backend";
import DataUtils from "../../utils/DataUtils";
import defaults from "./defaults";
import DockerHubForm from "./DockerHubForm";

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

  formRenderer(extras){
    if(this.props.vendor === 'dockerhub')
      return <DockerHubForm {...extras}/>;
    else
      return <p>Coming soon!</p>;
  }

  vendorQuestion(){ return defaults.imgVendorQuestion; }
  vendorList(){ return defaults.imageRegistryVendors; }
}