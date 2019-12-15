//@flow
import React from 'react'
import S from './ModalButtonStyles'

export default function ModalButton(props: Props) {
  return(
    <S.Main
      disabled={!props.isEnabled}
      onClick={props.callback}>
      {props.title}
    </S.Main>
  );
}

type Props = {
  title: string,
  callback: any => any,
  isEnabled: ?boolean
}

ModalButton.defaultProps = {
  isEnabled: true
};