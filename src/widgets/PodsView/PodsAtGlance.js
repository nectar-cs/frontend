import React from 'react'
import S from './PodsViewStyles'
import ModalClientComposer from "../../hocs/ModalClientComposer";
import PodModal from "../../modals/PodModal/PodModal";

function PodsAtGlanceClass({deployment, matching, openModal}){
  const { pods } = deployment;
  const PodViews = () => pods.map(pod => (
    <S.PodCircle
      onClick={() => openModal(PodModal, {pod, deployment, matching})}
      key={pod.name}
      emotion={pod.state}
    />
  ));

  return(
    <S.Container>
      <PodViews/>
    </S.Container>
  )
}

const PodsAtGlance = ModalClientComposer.compose(
  PodsAtGlanceClass
);

export default PodsAtGlance;