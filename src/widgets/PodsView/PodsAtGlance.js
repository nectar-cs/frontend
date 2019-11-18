import React from 'react'
import S from './PodsViewStyles'
import ModalClientComposer from "../../hocs/ModalClientComposer";
import PodModal from "../../modals/PodModal/PodModal";

function PodsAtGlanceClass({deployment, matching, openModal, action}){
  const { pods } = deployment;

  const defAction = (pod) => openModal(PodModal, {pod, deployment, matching});
  action = (p) => action ? () => action(p) : defAction;

  const PodViews = () => pods.map(pod => (
    <S.PodCircle
      onClick={() => action(pod)}
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