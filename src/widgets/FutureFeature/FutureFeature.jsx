//@flow
import React, {Fragment} from 'react'
import S from './Styles'
import upcoming from "../../components/Root/upcoming";
import DataUtils from "../../utils/DataUtils";
import Utils from "../../utils/Utils";
import ComingSoonSection from "../ComingSoonSection/ComingSoonSection";

export default class FutureFeature extends React.Component<Props>{

  render(){
    const { featureName } = this.configBundle();
    return(
      <Fragment>
        <S.Title>Planned Feature: {featureName}</S.Title>
        { this.renderInfo() }
        { this.renderImages() }
        <ComingSoonSection/>
        <br/><br/>
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
    let imageIndices = [...Array(3).keys()];

    return imageIndices.map(imageIndex => (
      <S.PreviewImage
        key={imageIndex}
        src={this.imagePath(imageIndex + 1)}
      />
    ))
  }

  imagePath(index){
    const webKey = this.webKey();
    const dirName = `soons/${webKey}`;
    const imageName = `${webKey}-${index}.png`;
    return Utils.image(`${dirName}/${imageName}`);
  }

  webKey() {
    const snaked = DataUtils.camelStringToSnake(this.key());
    return snaked.replace('_', '-');
  }

  configBundle(){ return upcoming[this.key()]; }
  key() { return this.props.upcomingKey; }
}

type Props = {
  upcomingKey: string
}