//@flow
import React from 'react'
import {Loader} from "@nectar/js-common"

export default function CenterLoader(props: Props){
  return(
    <Loader.CenteredSpinner
      size='large'
      emotion={props.contrast && 'contrastColor'}
    />
  );
}

type Props = {contrast: boolean};
CenterLoader.defaultProps = {contrast: false};
