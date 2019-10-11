import React, {Fragment} from 'react'
import defaults from './defaults'
import TextOverLineSubtitle from "../../widgets/TextOverLineSubtitle/TextOverLineSubtitle";
import S from './CheckStepStyles'
import Layout from "../../assets/layouts";
import Text from './../../assets/text-combos'
import Helper from "./Helper";

export default class CheckStep extends React.Component {
  render(){
    return(
      <Fragment>
        { this.renderTitle() }
        { this.renderExplanation() }
        { this.renderConsole() }
        { this.renderVerdict() }
        { this.renderAnalysis() }
        { this.renderNextStepText() }
      </Fragment>
    )
  }

  renderTitle(){
    return <TextOverLineSubtitle text={this.config().title}/>;
  }

  renderConsole(){
    return(
      <Layout.BigCodeViewer>
        <Text.Code>Hey</Text.Code>
      </Layout.BigCodeViewer>
    )
  }

  renderExplanation(){
    const Points = () => this.config().explanation.map(exp => (
      <li key={exp}><p>{exp}</p></li>
    ));
    return(
      <S.Explanation>
        <Points/>
      </S.Explanation>
    )
  }

  renderVerdict(){
    const verdict = false;

    return(
      <S.VerdictLine>
        <Text.BoldStatus>VERDICT:</Text.BoldStatus>
        <Text.BoldStatus
          pushed={true}
          emotion={Helper.verdictEmotion(verdict)}>
          { Helper.verdictString(verdict) }
        </Text.BoldStatus>
      </S.VerdictLine>
    )
  }

  renderAnalysis() {
    const verdict = false;
    if (verdict) return null;
    const Points = () => this.analysis().map(exp => (
      <li key={exp}><p>{exp}</p></li>
    ));
    return <S.Explanation><Points/></S.Explanation>;
  }


  renderNextStepText() {
    const verdict = false;
    if (!verdict) return null;
    return(<Fragment>

    </Fragment>)
  }

  key(){
    const key = this.constructor.name;
    return key.charAt(0).toLowerCase() + key.slice(1);
  }

  analysis(){ return ["This is broken", "So is that"]; }
  config() { return defaults[this.key()] }
}