//@flow
import React from 'react'
import FormComponent from "../../hocs/FormComponent";
import Utils from "../../utils/Utils";
import defaults from './defaults'
import {Layout} from "@nectar/js-common";

class CheatSheetFormFunc extends React.Component<Props>{

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Layout.Div top={-1} bottom={5}>
        { this.renderApiAndNs() }
        { this.renderFlavAndExec() }
      </Layout.Div>
    )
  }

  renderApiAndNs(){
    return this.props.makeLine("API", [
      () => this.renderApiSelect(),
      () => this.renderNamespaceSelect()
    ]);
  }

  renderApiSelect(){
    return this.props.makeSelectItem(
      "api",
      Utils.arrayOfHashesOptions(defaults.apiChoices)
    );
  }

  renderNamespaceSelect(){
    if(!this.isKubectl()) return null;
    return this.props.makeSelectItem(
      "withNs",
      Utils.hashOptions({true: "Explicit NS", false: "Implicit NS"})
    );
  }

  renderFlavAndExec(){
    if(!this.isKubectl()) return null;
    return this.props.makeLine("Flavor and Exec", [
      () => this.renderFlavorsSelect(),
      () => this.renderExecNameInput()
    ]);
  }

  renderExecNameInput(){
    return this.props.makeInputItem("execName", "e.g microk8s.kubectl");
  }

  renderFlavorsSelect(){
    const options = Utils.arrayOfHashesOptions(defaults.kubectlFlavors);
    return this.props.makeSelectItem("flavor", options);
  }

  isKubectl(){ return this.props.api === 'kubectl'; }
}

type Props = {
  api: string,
  flavor: string,
  execName: string,
  withNs: boolean
};

const CheatSheetForm = FormComponent.compose(
  CheatSheetFormFunc
);

export default CheatSheetForm;
