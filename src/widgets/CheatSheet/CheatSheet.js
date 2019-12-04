//@flow
import React, { Fragment } from 'react';
import CheatSheetForm from './CheatSheetForm';
import Text from '../../assets/text-combos';
import deploymentCopy from './deployment';
import Interpolation from './Interpolation';
import Layout from '../../assets/layouts';
import S from './Styles';

export default class CheatSheet extends React.Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      api: 'kubectl',
      flavor: 'json_jq',
      execName: 'kubectl',
      withNs: 'true',
      showConfig: false,
    };
    this.update = this.update.bind(this);
    this.toggleConfig = this.toggleConfig.bind(this);
  }

  render() {
    return (
      <Fragment>
        {this.renderConfigToggle()}
        {this.renderForm()}
        {this.renderSections()}
      </Fragment>
    );
  }

  renderConfigToggle() {
    return (
      <S.ConfigIcon onClick={this.toggleConfig} className="material-icons">
        settings
      </S.ConfigIcon>
    );
  }

  renderForm() {
    if (!this.state.showConfig) return null;
    const { api, flavor, execName, withNs } = this.state;
    return (
      <CheatSheetForm
        api={api}
        flavor={flavor}
        execName={execName}
        withNs={withNs}
        notifyFormValueChanged={this.update}
      />
    );
  }

  renderSections() {
    const { api } = this.state;
    if (api === 'kubectl') {
      const Sections = () => this.resourceConfig().map(section => this.renderSection(section));
      return (
        <Layout.Div top={-2.4}>
          <Sections />
        </Layout.Div>
      );
    } else return <Text.P low={4}>Under construction :/</Text.P>;
  }

  renderSection(section) {
    const { api, flavor } = this.state;
    const cmdBundles = (section.apis[api] || []).filter(
      bun => !bun.compat || bun.compat.includes(flavor),
    );

    const Blocks = () => cmdBundles.map(bun => this.renderBlock(bun));

    return (
      <Fragment>
        <Text.H5 top={2.2}>
          <b>{section.name}</b>
        </Text.H5>
        <Blocks />
      </Fragment>
    );
  }

  renderBlock(bundle) {
    const { withNs, flavor, execName } = this.state;
    const { resource } = this.props;

    const substitutions = {
      withNs: withNs === 'true',
      f: flavor,
      k: execName,
      ...this.resSubstitutor()(resource),
    };

    const CodeBlock = ({ children }) => <Layout.SlimCodeViewer>{children}</Layout.SlimCodeViewer>;

    let interp = bundle.cmd(substitutions);
    interp = typeof interp === 'string' ? [interp] : interp;
    const Lines = () => interp.map(c => <Text.Code chill>{c}</Text.Code>);

    return (
      <Fragment>
        <Text.P low={1.3} suck={1.1}>
          {bundle.desc}
        </Text.P>
        <CodeBlock>
          <Lines />
        </CodeBlock>
      </Fragment>
    );
  }

  resourceConfig() {
    // noinspection JSRedundantSwitchStatement
    switch (this.props.resourceName) {
      case 'deployment':
        return deploymentCopy;
      default:
        return [];
    }
  }

  resSubstitutor() {
    // noinspection JSRedundantSwitchStatement
    switch (this.props.resourceName) {
      case 'deployment':
        return Interpolation.inflateDeployment;
      default:
        return () => {};
    }
  }

  update(key, value) {
    this.setState(s => ({ ...s, [key]: value }));
  }

  toggleConfig() {
    this.update('showConfig', !this.state.showConfig);
  }
}

type Props = {
  resourceName: 'pod' | 'deployment',
  resource: *,
};
