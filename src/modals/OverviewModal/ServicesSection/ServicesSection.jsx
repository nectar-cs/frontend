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

class ServicesSectionClass extends React.Component{
  constructor(props) {
    super(props);
    this.state = { showInfo: true }
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
          <Text.Code>svc where ns={namespace} AND selector SUBSET OF [{str}] </Text.Code>
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
          <ServiceBox service={service}/>
        </S.LineTwo>
        <Text.P low={1.6}>Note that the effects of <b>Network
          Policies and Ingresses</b> are not taken into account
          in this picture. Coming soon :p
        </Text.P>
      </Layout.Div>
    )
  }

  renderPodSvcArrows(){
    return(
      <S.PodSvcArrowBox>
        <S.PodSvcArrow/>
        <S.PodSvcArrowTitle n={1}>&lt; Match</S.PodSvcArrowTitle>
        <S.PodSvcArrow/>
        <S.PodSvcArrowTitle n={2.35}>&lt; HTTP</S.PodSvcArrowTitle>
      </S.PodSvcArrowBox>
    )
  }

  renderDepSvcArrows(){
    return(
      <S.DepSvcArrowBox>
        <S.DepSvcArrow/>
        <S.DepSvcArrowTitle n={1}>v Create</S.DepSvcArrowTitle>
        <S.DepSvcArrow/>
        <S.DepSvcArrowTitle n={2}>v Match</S.DepSvcArrowTitle>
      </S.DepSvcArrowBox>
    )
  }
}

class ServiceBox extends React.Component{
  render(){
    const { selectorLabels, type } = this.props.service;
    return(
      <S.ServiceBox>
        <S.BoxTitle>Service: {type}</S.BoxTitle>
        <S.PodsTop>
          <LabelTags labels={selectorLabels}/>
          <S.PodsSep/>
          { this.renderTable() }
        </S.PodsTop>
      </S.ServiceBox>
    )
  }

  renderTable(){
    return(
      <table>
        <tbody>
        { this.genAddresses().map(a => this.renderRow(a)) }
        </tbody>
      </table>
    )
  }

  renderRow(addr){
    return(
      <tr>
        <td><p>{addr.ep}</p></td>
      </tr>
    )
  }

  genAddresses(){
    const { internalIp, externalIp } = this.props.service;
    const { ports, shortDns, longDns  } = this.props.service;

    return ports.map(pb => {
      return [
        { ep: `${shortDns}:${pb.toPort}` },
        { ep: `${longDns}:${pb.toPort}` },
        { ep: `${internalIp}:${pb.toPort}` }
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
        <S.PodsTop>
          <LabelTags labels={templateLabels}/>
          <S.PodsSep/>
          { this.renderPodRows() }
        </S.PodsTop>
      </S.PodsBox>
    )
  }

  renderPodRows(){
    const { pods } = this.props.deployment;
    return pods.map(pod => {
      return this.renderPodRow(pod);
    });
  }

  renderPodRow(pod){
    const { deployment } = this.props;
    const shortName = pod.name.replace(`${deployment.name}-`, '');
    return(
      <S.PodRow>
        <S.PodStatus emotion={pod.state}/>
        <p>{shortName}</p>
        <p>&nbsp;&nbsp;@&nbsp;&nbsp;</p>
        <a href={pod.ip}><p>{pod.ip}</p></a>
      </S.PodRow>
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
          <LabelTags labels={templateLabels}/>
        </S.DepBoxHalf>
        <S.DepBoxLine><S.DepBoxSep/></S.DepBoxLine>
        <S.DepBoxHalf>
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

export default ServicesSection;