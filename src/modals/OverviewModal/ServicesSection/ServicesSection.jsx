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

class ServiceVisual extends React.Component<ServiceVisualProps>{
  render(){
    const { deployment, service, index } = this.props;
    const title = `Service ${index + 1}: ${service.name}`;

    return(
      <Layout.Div top={2}>
        <Text.H5 top={-2} bottom={2}>{title}</Text.H5>
        <DepBox deployment={deployment}/>
      </Layout.Div>
    )
  }
}

class DepBox extends React.Component<DepBoxProps>{
  render(){
    const { name, labels } = this.props.deployment;
    return(
      <S.DepBox>
        <S.BoxTitle>Dep: {name}</S.BoxTitle>
        <S.DepBoxHalf/>
        <S.DepBoxLine><S.DepBoxSep/></S.DepBoxLine>
        <S.DepBoxHalf/>
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