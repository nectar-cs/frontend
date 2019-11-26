//@flow

import React, {Fragment} from 'react'
import ModalClientComposer from "../../../hocs/ModalClientComposer";
import Layout from "../../../assets/layouts";
import defaults from "./defaults";
import S from './Styles'
import type {Deployment, Service} from "../../../types/Types";
import VertSection from "../../../widgets/VertSection/VertSection";
import Text from "../../../assets/text-combos";
import Utils from "../../../utils/Utils";
import LabelTags from "../../../widgets/LabelTags/LabelTags";

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
        <Layout.BigCodeViewer>
          <Text.Code>svc where ns={namespace} AND selector SUBSET OF [{str}] </Text.Code>
        </Layout.BigCodeViewer>
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

class ServiceVisual extends React.Component<ServiceVisualProps>{
  render(){
    const { deployment, service, index } = this.props;
    const title = `Service ${index + 1}: ${service.name}`;

    return(
      <Layout.Div top={2} bottom={7}>
        <Text.H5 top={-2} bottom={2}>{title}</Text.H5>
        <DepBox deployment={deployment}/>
        { this.renderDepSvcArrows() }
        <PodBox deployment={deployment}/>
      </Layout.Div>
    )
  }

  renderDepSvcArrows(){
    return(
      <S.DepSvcArrowBox>
        <S.DepSvcArrow/>
        <S.DepSvcArrow/>
      </S.DepSvcArrowBox>
    )
  }
}

class DepBox extends React.Component<DepBoxProps>{
  render(){
    const { name, selectorLabels, templateLabels } = this.props.deployment;
    return(
      <S.DepBox>
        <S.BoxTitle>Dep: {name}</S.BoxTitle>
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