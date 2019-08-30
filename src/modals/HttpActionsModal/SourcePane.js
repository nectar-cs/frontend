import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import s from './SourcePane.sass'
import MiscUtils from "../../utils/MiscUtils";

export default class SourcePane extends React.Component {

  render(){
    return(
      <Fragment>
        <p><i>Where</i> your request comes from matters in some cases.
          Network Policies, Ingress, and service meshes
          can modulate requests based on their origin.</p>
        <div className={s.inputLine}>
          <p className={s.label}>Source Type</p>
          <select
            className={s.typeSelect}
            value={this.props.type}
            onChange={(e) => this.broadcastChange('type', e)}>
            {SourcePane.typeOptions()}
          </select>
        </div>

        { this.renderConditionalFields() }
      </Fragment>
    )
  }

  renderConditionalFields(){
    if(this.props.type === 'test-pod')    {
      return this.renderNamespaceSelector()
    } else return <p className={s.comingSoon}>Coming soon :)</p>
  }

  renderNamespaceSelector(){
    return(
      <div className={s.inputLine}>
        <p className={s.label}>Pod Namespace</p>
        <select
          className={s.typeSelect}
          value={this.props.namespace}
          onChange={(e) => this.broadcastChange('namespace', e)}>
          { MiscUtils.arrayOptions(this.props.namespaces) }
        </select>
      </div>
    )
  }

  broadcastChange(field, event){
    const assignment = { [field]: event.target.value };
    this.props.onFieldChanged(assignment)
  }

  static typeOptions(){
    return MiscUtils.hashOptions({
      'test-pod': "A one time pod we create inside your cluster",
      'www': "One of our servers on the web",
      'mimic-pod': "A one time pod we create inside your cluster that mimics a deployment"
    })
  }

  static propTypes = {
    type: PropTypes.oneOf(['test-pod', 'web', 'mimic-pod']),
    namespaces: PropTypes.arrayOf(PropTypes.string),
    onFieldChanged: PropTypes.func.isRequired
  }

}