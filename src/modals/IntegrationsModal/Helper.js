import React from "react";
import DockerHub from "./DockerHub";

export default class Helper {
  static rendererForVendor(vendor){
    if(vendor === 'dockerhub')
      return <DockerHub/>;
    else
      return <p>Coming soon!</p>;
  }
}