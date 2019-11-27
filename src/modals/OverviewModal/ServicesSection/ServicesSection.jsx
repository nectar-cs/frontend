//@flow

import React, {Fragment} from 'react'
import ModalClientComposer from "../../../hocs/ModalClientComposer";
import Layout from "../../../assets/layouts";
import defaults from "./defaults";
import S from './Styles'
import type {Deployment, Service} from "../../../types/Types";
import Text from "../../../assets/text-combos";
import Utils from "../../../utils/Utils";
import LabelTags from "../../../widgets/LabelTags/LabelTags";
import Tables from "../../../assets/table-combos";
import Micon from "../../../widgets/Micon/Micon";
import HttpActionsModal from "../../HttpActionsModal/HttpActionsModal";
import ModalHostComposer from "../../../hocs/ModalHostComposer";

class ServicesSectionClass extends React.Component{
  constructor(props) {
    super(props);
    this.state = { showInfo: false }
  }

  render(){
    return(
      <Fragment>
        { this.renderInfoIcon() }
        { this.renderIntro() }
        { this.renderServiceVisuals() }
      </Fragment>
    )
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
    return deployment.services.map((service, i) => (
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
          <PodBox deployment={deployment}/>
          { this.renderPodSvcArrows() }
          <ServiceBox deployment={deployment} service={service}/>
        </S.LineTwo>
        <Text.P low={1.6}>{defaults.effectsWarning}</Text.P>
      </Layout.Div>
    )
  }

  renderPodSvcArrows(){
    return(
      <S.PodSvcArrowBox>
        <S.PodSvcArrow/>
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
        <Text.P low={0.2} suck={-0.5}>I match pods w/</Text.P>
        <LabelTags labels={selectorLabels}/>
        <S.PodsSep/>
        { this.renderAddressesTable() }
        <S.PodsSep/>
        { this.renderEndpointsTable() }
      </S.ServiceBox>
    )
  }

  renderEndpointsTable(){
    return(
      <Fragment>
        <Text.P low={0.4} suck={-0.5}><b>Endpoints</b> - Where K8s has me fwd traffic to</Text.P>
        <Tables.SlimTable raw borderless>
          <tbody>
          { this.genAddresses().map(a => this.renderRow(a)) }
          </tbody>
        </Tables.SlimTable>
      </Fragment>
    )
  }

  renderAddressesTable(){
    return(
      <Fragment>
        <Text.P low={0.5} suck={-0.5}><b>Addresses</b> - How to reach me</Text.P>
        <Tables.SlimTable raw borderless space={0.35}>
          <tbody>
          { this.genAddresses().map(a => this.renderRow(a)) }
          </tbody>
        </Tables.SlimTable>
      </Fragment>
    )
  }

  renderRow(addr){
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
    const { ports, shortDns, longDns  } = this.props.service;

    return ports.map(pb => {
      const { fromPort, toPort } = pb;
      return [
        { ep: shortDns, fromPort, toPort, scope: 'internal' },
        { ep: longDns, fromPort, toPort, scope: 'internal' },
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
        <S.BoxTitle>The Pods</S.BoxTitle>
        <Text.P low={0.2} suck={-0.5}>We're matched by</Text.P>
        <LabelTags labels={templateLabels}/>
        <S.PodsSep/>
        { this.renderPodsTable() }
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
    const { deployment } = this.props;
    const shortName = pod.name.replace(`${deployment.name}-`, '');
    return(
      <tr>
        <td><S.PodStatus emotion={pod.state}/></td>
        <td><p>{shortName}</p></td>
        <td><a href={pod.ip}><p>{pod.ip}</p></a></td>
      </tr>
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
          <Text.P low={0.2} center suck={-0.5}>Match pods w/</Text.P>
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