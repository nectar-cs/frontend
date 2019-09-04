import React from 'react'
import {Table} from "./ImageReplaceTableStyles";
import PropTypes from 'prop-types'
import Kapi from "../../utils/Kapi";


export default class ImageReplaceTable extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      initialPods: [],
      updatedPods: null
    };
    this._isMounted = false;
    this.reloadPods = this.reloadPods.bind(this);
  }

  componentDidMount(){
    this._isMounted = true;
    this.fetchPods('initialPods')
  }

  componentWillUpdate(nextProps){
    if(!this.props.autoUpdate && nextProps.autoUpdate)
      this.reloadPods(true);
  }

  componentWillUnmount(){
    this._isMounted = false;
  }

  fetchPods(field, runAfter){
    if(!this._isMounted) return;
    const { depName, depNamespace } = this.props;
    const endpoint = `/api/deployments/${depNamespace}/${depName}/pods`;
    Kapi.fetch(endpoint, (resp) => {
      if(!this._isMounted) return;
      console.table(resp['data']);
      this.setState(s => ({...s, [field]: resp['data']}));
      runAfter && runAfter();
    })
  }

  reloadPods(force){
    if(force || this.props.autoUpdate){
      let repeat = () => setTimeout(this.reloadPods, 1000);
      this.fetchPods('updatedPods', repeat)
    }
  }

  render(){
    return(
      <Table>
        <tbody>
          <HeaderRow/>
          { this.renderList() }
        </tbody>
      </Table>
    )
  }

  enrichOldPod(pod){
    const newPods = this.state.updatedPods;
    let actualState;
    if(newPods != null){
      const newSelf = newPods.find(newPod => newPod.name === pod.name);
      actualState = newSelf ? newSelf.state : 'gone';
    } else actualState = pod.state;
    return { ...pod, desiredState: 'gone', state: actualState }
  }

  enrichNewPod(pod){
    return { ...pod, desiredState: 'running' }
  }
  
  strictlyNewPods(){
    if(this.state.updatedPods === null) return [];

    const oldNames = this.state.initialPods.map(op => op.name);
    return this.state.updatedPods.filter(newPod => (
      !oldNames.includes(newPod.name)
    ));
  }

  renderList(){
    const initial = this.state.initialPods;
    const updated = this.strictlyNewPods();
    const enrichedOldPods = initial.map(p => this.enrichOldPod(p));
    const enrichedNewPods = updated.map(p => this.enrichNewPod(p));
    const podsToRender = enrichedOldPods.concat(enrichedNewPods);

    return podsToRender.map(pod => {
      return(
        <PodRow key={pod.name} {...pod}/>
      )
    })
  }

  static propTypes = {
    depName: PropTypes.string.isRequired,
    depNamespace: PropTypes.string.isRequired,
    autoUpdate: PropTypes.bool
  }
}

function PodRow(props){
  return(
    <tr>
      <td><p>{props.name}</p></td>
      <td><p>{props.state}</p></td>
      <td><p>{props.desiredState}</p></td>
    </tr>
  )
}

function HeaderRow(){
  return(
    <tr>
      <th><p>Name</p></th>
      <th><p>Actual State</p></th>
      <th><p>Desired State</p></th>
    </tr>
  )
}