import React from 'react'
import IntegrationSection from "./IntegrationSection";
import Backend from "../../utils/Backend";
import DataUtils from "../../utils/DataUtils";
import defaults from "./defaults";
import DockerHubForm from "./DockerHubForm";
import {S} from './IntegrationSectionStyles'

export default class DockerSection extends IntegrationSection {
  performFetch(whenDone){
    Backend.raisingFetch('/image_registries', (resp) => {
      whenDone(DataUtils.objKeysToCamel(resp['data']));
    });
  }

  performAuthUrlsFetch(whenDone){
    whenDone([]);
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
      return <S.Apology>Coming soon!</S.Apology>;
  }

  vendorQuestion(){ return defaults.imgVendorQuestion; }
  vendorList(){ return defaults.imageRegistryVendors; }
}