import React from "react";
import DockerHubForm from "./DockerHubForm";

export default class Helper {
  static rendererForVendor(vendor, props){
    if(vendor === 'dockerhub')
      return <DockerHubForm {...props}/>;
    else
      return <p>Coming soon!</p>;
  }
}