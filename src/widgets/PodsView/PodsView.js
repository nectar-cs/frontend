import React from 'react'
import S from './PodsViewStyles'

export default function PodsView({pods}){
  const PodViews = () => pods.map(pod => (
    <S.PodCircle key={pod.name} emotion={pod.state} />
  ));

  return(
    <S.Container>
      <PodViews/>
    </S.Container>
  )
}