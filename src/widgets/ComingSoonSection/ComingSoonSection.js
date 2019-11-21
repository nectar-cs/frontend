import React, {Fragment} from "react";
import S from './ComingSoonSectionStyles'

export default function ComingSoonSection({text, imageOne, size}){

  return(
    <Fragment>
      <S.Icon size={size} src={imageOne} />

      <S.Words>
        If you're a world class engineer, and want to First Five
        at the startup bringing order to orchestration, drop me a line.
      </S.Words>

      <S.Words>
        London, San Francisco, or Remote.
      </S.Words>

      <S.Words>
        4x Senior Engineer, Design, CTO, VP Developer Advocacy.
      </S.Words>

      <a href='mailto: xavier@codenectar.com'><S.Words>xavier@codenectar.com</S.Words></a>


    </Fragment>
  )
}

ComingSoonSection.defaultProps = {
  imageOne: 'https://storage.googleapis.com/nectar-mosaic-public/images/simpsons-join-lolz.gif',
  size: 'large'
};