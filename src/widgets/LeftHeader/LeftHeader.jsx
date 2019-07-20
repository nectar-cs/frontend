// @flow
import React from 'react';
import s from './LeftHeader.sass'
import ReactSVG from 'react-svg'

export const IMAGE = "image";
export const ICON = "icon";

type Props = {
  title: string,
  subtitle: string,
  graphicType?: IMAGE | ICON,
  graphicName: string
};

export class LeftHeader extends React.Component<Props> {

  render(){
    const { title, subtitle } = this.props;
    return(
      <div className={s.leftHeader}>
        { this.renderGraphic() }
        <div className={s.textBox}>
          <h2 className={s.title}>{title}</h2>
          <p className={s.subtitle}>{subtitle}</p>
        </div>
      </div>
    )
  }

  renderGraphic(): React.Node {
    if(this.props.graphicType === ICON){
      return this.renderMaterialIcon();
    } else return this.renderImage();
  }

  renderMaterialIcon(): React.Node{
    return(
      <i className={`material-icons ${s.icon}`}>
        { this.props.graphicName }
      </i>
    )
  }

  renderImage(){
    const source = this.props.graphicName;
    if(source.includes('.svg'))
      return <ReactSVG svgClassName={s.image} src={source}/>;
    else
      return <img src={source} className={s.image} alt={null}/>;
  }

  static defaultProps = {
    graphicType: 'material-icon'
  }

}