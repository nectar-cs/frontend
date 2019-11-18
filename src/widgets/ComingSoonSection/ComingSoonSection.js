import React, {Fragment} from "react";
import S from './ComingSoonSectionStyles'

export default function ComingSoonSection({text, imageOne, size}){
  return(
    <Fragment>
      <S.Icon size={size} src={imageOne} />
      <a><S.Text>Hit me up</S.Text></a>
    </Fragment>
  )
}

ComingSoonSection.defaultProps = {
  imageOne: 'https://storage.googleapis.com/nectar-mosaic-public/images/simpsons-join-lolz.gif',
  size: 'large'
};