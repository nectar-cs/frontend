//@flow
import React, {Fragment} from 'react'
import S from './Styles'
import upcoming from "../../containers/upcoming";
import DataUtils from "../../utils/DataUtils";

export default class FutureFeature extends React.Component<Props>{

  render(){
    const { featureName } = this.configBundle();
    return(
      <Fragment>
        <S.Title>Planned Feature: {featureName}</S.Title>
        { this.renderInfo() }
        { this.renderImages() }
      </Fragment>
    )
  }

  renderInfo(){
    const { info } = this.configBundle();
    return info.map(line => (
      <S.Subtitle key={line}>{line}</S.Subtitle>
    ))
  }

  renderImages(){
    return null;
    // const { imageSrcs } = this.props;
    // return imageSrcs.map(imageSrc => (
    //   <S.PreviewImage src={imageSrc}/>
    // ));
  }

  imagesPaths(){

  }

  webKey() {
    const snaked = DataUtils.camelStringToSnake(this.key());
    return snaked.replace('_', '-');
  }
  baseWebPath(){ return `soons/${this.webKey()}`; }
  configBundle(){ return upcoming[this.key()]; }
  key() { return this.props.upcomingKey; }
}

type Props = {
  upcomingKey: string
}