import Utils from "../../utils/Utils";
import {Text} from "@nectar/js-common";
import React from "react";

export default function LabelTags({labels}){
  return Utils.labelsToDictStrs(labels).map(label => (
    <Text.StatusTag
      key={label}
      emotion='pleasant'
      top={0.5}
      right={0.3}
    >{label}
    </Text.StatusTag>
  ))
}
