import React from "react";
import defaults from "./defaults";
import Utils from "../../utils/Utils";

export default class Helper {
  static imgName(name){
    const imgVendors = defaults.imageRegistryVendors;
    const gitVendors = defaults.gitRemoteVendors;
    const superList = imgVendors.concat(gitVendors);
    const nm = superList.find(v => v.name === name);
    const args = nm ? nm.image : [];
    return Utils.frameworkImage(...args);
  }
}