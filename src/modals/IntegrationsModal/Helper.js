import React from "react";
import DockerHubForm from "./DockerHubForm";
import defaults from "./defaults";
import MiscUtils from "../../utils/MiscUtils";

export default class Helper {
  static rendererForVendor(vendor, props){
    if(vendor === 'dockerhub')
      return <DockerHubForm {...props}/>;
    else
      return <p>Coming soon!</p>;
  }

  static imgName(name){
    const imgRegVendors = defaults.imageRegistryVendors;
    const remGitVendors = defaults.gitRemoteVendors;
    const superList = imgRegVendors.concat(remGitVendors);
    const nm = superList.find(v => v.name === name).image;
    return MiscUtils.frameworkImage(...nm);
  }

}