//@flow
import React from 'react'
import {Loader} from 'ui-common'

export default function CenterLoader(props: Props){
  return(
    <Loader.ModSpinner
      size='large'
      emotion={props.contrast && 'contrastColor'}
    />
  );
}

type Props = {contrast: boolean};
CenterLoader.defaultProps = {contrast: false};