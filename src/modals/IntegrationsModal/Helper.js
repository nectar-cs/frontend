import React from "react";
import DockerHubForm from "./DockerHubForm";

export default class Helper {
  static rendererForVendor(vendor){
    if(vendor === 'dockerhub')
      return <DockerHubForm/>;
    else
      return <p>Coming soon!</p>;
  }
}