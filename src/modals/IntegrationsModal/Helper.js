import React from "react";
import DockerHubForm from "./DockerHubForm";
import defaults from "./defaults";
import MiscUtils from "../../utils/MiscUtils";

export default class Helper {
  static imgName(name){
    const imgVendors = defaults.imageRegistryVendors;
    const gitVendors = defaults.gitRemoteVendors;
    const superList = imgVendors.concat(gitVendors);
    const nm = superList.find(v => v.name === name);
    const args = nm ? nm.image : [];
    return MiscUtils.frameworkImage(...args);
  }

}