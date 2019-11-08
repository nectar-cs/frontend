import React from 'react'
import Section from "./Section";
import ChooseDebugTypeModal from "../../../modals/ChoseDebugTypeModal/ChooseDebugTypeModal";

export default class InfraDebugSection extends Section {

  _renderActivityModal(source){
    const { deployment, matching } = source || this.props;
    return(
      <ChooseDebugTypeModal
        mode='fragment'
        deployment={deployment}
        matching={matching}
      />
    );
  }

  _className() { return InfraDebugSection._className() }
  static _className(){ return "InfraDebugSection"; }
}