//@flow

import React, {Fragment} from 'react'
import ModalClientComposer from "../../../hocs/ModalClientComposer";
import {Layout} from "@nectar/js-common";
import defaults from "./defaults";
import S from './Styles'
import type {Deployment, Service} from "../../../types/Types";
import Utils from "../../../utils/Utils";
import LabelTags from "../../../widgets/LabelTags/LabelTags";
import Micon from "../../../widgets/Micon/Micon";
import HttpActionsModal from "../../HttpActionsModal/HttpActionsModal";
import ModalHostComposer from "../../../hocs/ModalHostComposer";
import Kapi from "../../../utils/Kapi";
import {Text, Tables, Loader} from "@nectar/js-common";

class ServicesSectionClass extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      showInfo: false,
      isFetching: false,
      services: (props.deployment || {}).services
    }
  }

  async componentDidMount(): * {
    const { deployment: dep } = this.props;
    this.setState(s => ({...s, isFetching: true}));
    const ep = `/api/deployments/${dep.namespace}/${dep.name}/services`;
    const services = await Kapi.bFetch(ep);
    this.setState(s => ({...s, services, isFetching: false}));
  }

  render(){
    return(
      <Fragment>
        { this.renderLoader() }
        { this.renderInfoIcon() }
        { this.renderIntro() }
        { this.renderServiceVisuals() }
      </Fragment>
    )
  }

  renderLoader(){
    if(!this.state.isFetching) return null;
    return <Loader.TopRightSpinner/>;
  }

  renderInfoIcon(){
    const cb = () => this.setState(s => ({...s, showInfo: !s.showInfo}));
    return(
      <S.InfoIcon onClick={cb} className='material-icons'>info</S.InfoIcon>
    )
  }

  renderIntro(){
    if(!this.state.showInfo) return null;

    const { namespace, templateLabels } = this.props.deployment;
    const str = Utils.labelsToDictStr(templateLabels);
    return(
      <Layout.Div top={-1.0} bottom={5}>
        { defaults.intro }
        <Layout.SlimCodeViewer>
          <Text.Code>{defaults.pseudoQuery(namespace, str)}</Text.Code>
        </Layout.SlimCodeViewer>
      </Layout.Div>
    )
  }

  renderServiceVisuals(){
    const { deployment } = this.props;
    const { services } = this.state;
    if(services == null) return null;

    return services.map((service, i) => (
      <ServiceVisual
        key={i}
        index={i}
        deployment={deployment}
        service={service}
      />
    ));
  }
}

class ServiceVisual extends React.Component<ServiceVisualProps>{
  render(){
    const { deployment, service, index } = this.props;
    const title = `Service ${index + 1}: ${service.name}`;
    return(
      <Layout.Div top={2} bottom={7}>
        <Text.H5 top={-2} bottom={2}>{title}</Text.H5>
        <DepBox deployment={deployment}/>
        { this.renderDepSvcArrows() }
        <S.LineTwo>
          <PodBox
            deployment={deployment}
            service={service}
          />
          { this.renderPodSvcArrows() }
          <ServiceBox
            deployment={deployment}
            service={service}
          />
        </S.LineTwo>
        <Text.P low={1.6}>{defaults.effectsWarning}</Text.P>
      </Layout.Div>
    )
  }

  renderPodSvcArrows(){
    return(
      <S.PodSvcArrowBox>
        <S.PodSvcArrow/>
      </S.PodSvcArrowBox>
    )
  }

  renderDepSvcArrows(){
    return(
      <S.DepSvcArrowBox>
        <S.DepSvcArrow/>
        <S.DepSvcArrowTitle n={1}>Create</S.DepSvcArrowTitle>
        <S.DepSvcArrow/>
        <S.DepSvcArrowTitle n={2}>Match</S.DepSvcArrowTitle>
      </S.DepSvcArrowBox>
    )
  }
}

class ServiceBoxClass extends React.Component{
  render(){
    const { selectorLabels, type } = this.props.service;
    return(
      <S.ServiceBox>
        <S.BoxTitle>Service: {type}</S.BoxTitle>
        <Text.P low={0.2} suck={-0.5}>Match pods w/ at least</Text.P>
        <LabelTags labels={selectorLabels}/>
        <S.PodsSep/>
        { this.renderAddressesTable() }
        <S.PodsSep/>
        { this.renderEndpointsTable() }
        { this.renderLegend() }
      </S.ServiceBox>
    )
  }

  renderEndpointsTable(){
    const endpoints = this.props.service.endpoints;
    if(endpoints == null) return;

    if(endpoints.length === 0)
      return <Text.P center low={4}>{defaults.noEndpoints}</Text.P>;

    return(
      <Fragment>
        <Text.P low={1.5} suck={-0.5}><b>Endpoints</b> - Actual computed targets</Text.P>
        <Tables.SlimTable raw borderless space={0.35}>
          <tbody>
          { endpoints.map(a => this.renderEndpointRow(a)) }
          </tbody>
        </Tables.SlimTable>
      </Fragment>
    )
  }

  renderAddressesTable(){
    return(
      <Fragment>
        <Text.P low={1.5} suck={-0.5}><b>Addresses</b> - How to reach me</Text.P>
        <Tables.SlimTable raw borderless space={0.35}>
          <tbody>
          { this.genAddresses().map(a => this.renderAddressRow(a)) }
          </tbody>
        </Tables.SlimTable>
      </Fragment>
    )
  }

  renderLegend(){
    return(
      <Fragment>
        <Layout.TextLine low={1.5}>
          <Micon n='check' emotion='success' size='s'/>
          <Text.P pushed low={0.2}>Means target is a pod in this deployment</Text.P>
        </Layout.TextLine>
        <Layout.TextLine low={0.5}>
          <Micon n='close' emotion='fail' size='s'/>
          <Text.P pushed low={0.2}>Means it is <b>not</b></Text.P>
        </Layout.TextLine>
      </Fragment>
    )
  }

  renderEndpointRow(endpoint){
    const { targetName: name, targetIp: ip } = endpoint;
    const { pods } = this.props.deployment;
    const podFound = !!pods.find(p => p.ip === ip);
    const iconName = podFound ? 'check' : 'close';
    const iconColor = podFound ? 'success' : 'fail';
    const Icon = () => <Micon size='s' n={iconName} emotion={iconColor}/>;

    return(
      <tr>
        <td><p>{Utils.tinyPodName(name)}</p></td>
        <td><p>{ip}</p></td>
        <td><Icon/></td>
      </tr>
    )
  }

  renderAddressRow(addr){
    const { openModal, deployment } = this.props;
    const { ep, fromPort, toPort, scope } = addr;
    const scopeIcon = scope === 'internal' ?
      'settings_input_hdmi' : 'wifi_tethering';

    const callbackBundle = { deployment, targetHost: ep, targetPort: fromPort };
    const callback = () => openModal(HttpActionsModal, callbackBundle);

    const Addr = (p) => addr.ep ? <Text.AA>{p.children}</Text.AA> : <p>none</p>;
    return(
      <tr onClick={callback}>
        <td><Micon top={0.33} size='s' n={scopeIcon}/></td>
        <td><Addr>{ep}</Addr></td>
        <td><p>{fromPort}</p></td>
        <td><p>{toPort}</p></td>
      </tr>
    )
  }

  genAddresses(){
    const { internalIp, externalIp } = this.props.service;
    const { ports, shortDns  } = this.props.service;

    return ports.map(pb => {
      const { fromPort, toPort } = pb;
      return [
        { ep: shortDns, fromPort, toPort, scope: 'internal' },
        { ep: internalIp, fromPort, toPort, scope: 'internal' },
        { ep: externalIp, fromPort, toPort, scope: 'external' },
      ];
    }).flat();
  }
}

class PodBox extends React.Component{
  render(){
    const { templateLabels } = this.props.deployment;
    return(
      <S.PodsBox>
        <S.BoxTitle>Pods</S.BoxTitle>
        <Text.P low={0.2} suck={-0.5}>We're matched by</Text.P>
        <LabelTags labels={templateLabels}/>
        <S.PodsSep/>
        { this.renderPodsTable() }
        { this.renderLegend() }
      </S.PodsBox>
    )
  }

  renderPodsTable(){
    const { pods } = this.props.deployment;
    const PodRows = () => pods.map(pod => {
      return this.renderPodRow(pod);
    });

    return(
      <Tables.SlimTable raw borderless>
        <tbody>
        <PodRows/>
        </tbody>
      </Tables.SlimTable>
    )
  }

  renderPodRow(pod){
    const { service } = this.props;
    const endpoints  = service.endpoints || [];

    const isCovered = endpoints.find(ep => ep.targetName === pod.name);
    const iconColor = isCovered ? 'success' : 'fail';
    const iconName = isCovered ? 'check' : 'close';
    const Icon = () => <Micon n={iconName} emotion={iconColor}/>;

    return(
      <tr>
        <td><S.PodStatus emotion={pod.state}/></td>
        <td><p>{Utils.tinyPodName(pod.name)}</p></td>
        <td><a href={`http://${pod.ip}`}><p>{pod.ip}</p></a></td>
        <td><Icon/></td>
      </tr>
    )
  }

  renderLegend(){
    const { service } = this.props;
    return(
      <Fragment>
        <Layout.TextLine low={1.5}>
          <Micon n='check' emotion='success' size='s'/>
          <Text.P pushed low={0.2}>Means svc '{service.name}' targets this pod</Text.P>
        </Layout.TextLine>
        <Layout.TextLine low={0.5}>
          <Micon n='close' emotion='fail' size='s'/>
          <Text.P pushed low={0.2}>Means target it does <b>not</b></Text.P>
        </Layout.TextLine>
      </Fragment>
    )
  }

}

class DepBox extends React.Component<DepBoxProps>{
  render(){
    const { selectorLabels, templateLabels } = this.props.deployment;
    return(
      <S.DepBox>
        <S.BoxTitle>Deployment</S.BoxTitle>
        <S.DepBoxHalf>
          <Text.P low={0.2} center suck={-0.5}>Create pods w/</Text.P>
          <LabelTags labels={templateLabels}/>
        </S.DepBoxHalf>
        <S.DepBoxLine><S.DepBoxSep/></S.DepBoxLine>
        <S.DepBoxHalf>
          <Text.P low={0.2} center suck={-0.5}>Match pods w/ at least</Text.P>
          <LabelTags labels={selectorLabels}/>
        </S.DepBoxHalf>
      </S.DepBox>
    )
  }
}

type ServiceVisualProps = {
  index: number,
  deployment: Deployment,
  service: Service
}

type DepBoxProps = {
  deployment: Deployment
}

const ServicesSection = ModalClientComposer.compose(
  ServicesSectionClass
);

const ServiceBox = ModalHostComposer.compose(
  ServiceBoxClass
);

export default ServicesSection;
