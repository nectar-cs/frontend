//@flow
import React, {Fragment} from 'react'
import CheatSheetForm from "./CheatSheetForm";
import Text from "../../assets/text-combos";
import deploymentCopy from "./deployment";
import Interpolation from "./Interpolation";
import Layout from "../../assets/layouts";

export default class CheatSheet extends React.Component<Props> {

  constructor(props) {
    super(props);
    this.state = {
      api: 'kubectl',
      flavor: 'json_jq',
      execName: "kubectl",
      withNs: "true",
    };
    this.update = this.update.bind(this);
  }

  render() {
    return(
      <Fragment>
        { this.renderForm() }
        { this.renderSections() }
      </Fragment>
    )
  }

  renderForm(){
    const { api, flavor, execName, withNs } = this.state;
    return(
      <CheatSheetForm
        api={api}
        flavor={flavor}
        execName={execName}
        withNs={withNs}
        notifyFormValueChanged={this.update}
      />
    )
  }

  renderSections(){
    const { api } = this.state;
    if(api !== 'kubectl')
      return <Text.P low={4}>Under construction :/</Text.P>;

    const Sections = () => this.resourceConfig().map(section => (
      this.renderSection(section)
    ));

    return <Sections/>
  }

  renderSection(section){
    const { api, flavor } = this.state;
    const cmdBundles = (section.apis[api] || []).filter(bun =>
      !bun.compat || bun.compat.includes(flavor)
    );

    const Blocks = ()=> cmdBundles.map(bun => this.renderBlock(bun));

    return(
      <Fragment>
        <Text.P low={3}><b>{section.name}</b></Text.P>
        <Blocks/>
      </Fragment>
    )
  }

  renderBlock(bundle){
    const { withNs, flavor, execName } = this.state;
    const { resource } = this.props;

    const substitutions = {
      withNs,
      f: flavor,
      k: execName,
      ...this.resSubstitutor()(resource)
    };

    const CodeBlock = ({children}) => (
      <Layout.BigCodeViewer>{ children }</Layout.BigCodeViewer>
    );

    let code = null;
    const out = bundle.cmd(substitutions);
    console.log("TIME FOR " + bundle.desc);
    console.log(substitutions);
    console.log(out);
    if(typeof out === 'string')
      code = <Text.Code>{out}</Text.Code>;
    else code = () => out.map(c => <Text.Code>{c}</Text.Code>);

    return(
      <Fragment>
        <Text.P low={1.3} suck={1.1}>{bundle.desc}</Text.P>
        <CodeBlock>{code}</CodeBlock>
      </Fragment>
    );
  }

  resourceConfig(){
    switch (this.props.resourceName) {
      case "deployment": return deploymentCopy;
      default: return [];
    }
  }

  resSubstitutor(){
    switch (this.props.resourceName) {
      case "deployment":
        return Interpolation.inflateDeployment;
      default: return () => {};
    }
  }

  update(key, value){
    this.setState(s => ({...s, [key]: value}));
  }
}

type Props = {
  resourceName: 'pod' | 'deployment',
  resource: *
}