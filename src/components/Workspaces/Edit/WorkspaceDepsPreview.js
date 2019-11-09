//@flow
import React, {Fragment} from 'react'
import s from './WorkspaceDepsPreview.sass'
import Loader from "../../../assets/loading-spinner";
import type {Deployment} from "../../../types/Types";
import TextOverLineSubtitle from "../../../widgets/TextOverLineSubtitle/TextOverLineSubtitle";
import LeftHeader from "../../../widgets/LeftHeader/LeftHeader";

export default function WorkspaceDepsPreview(props: Props) {

  const { deployments, isFetching } = props;

  const DeploymentRows = () => deployments.map((deployment) => (
    <DeploymentRow
      key={deployment.name}
      {...deployment}
    />
  ));

  const Header = () => (
    <LeftHeader
      graphicName='cached'
      graphicType='icon'
      title='Preview'
      subtitle='Change the filters on the left side to see this update.'
    />
  );

  return (
    <Fragment>
      <Header/>
      <Loader.TopRightSpinner there={isFetching}/>
      <TextOverLineSubtitle text='Preview'/>
      <p>The following deployments will appear in your workspace:</p>
      <table className={s.table}>
        <tbody>
        <DeploymentHeaderRow/>
        <DeploymentRows/>
        </tbody>
      </table>
    </Fragment>
  )
}

function DeploymentRow(deployment: Deployment){
  const {name, namespace, labels} = deployment;

  const strLabels = Object.keys(labels || {}).map((k) => (
    `${k}:${(labels || {})[k]}`
  ));

  const LabelViews = () => strLabels.map((label) => (
    <p key={label} className={s.statusTag}>{label}</p>
  ));

  return(
    <tr>
      <td><p>{name}</p></td>
      <td><p>{namespace}</p></td>
      <td><LabelViews/></td>
    </tr>
  );
}

function DeploymentHeaderRow(){
  return(
    <tr>
      <th><p>Name</p></th>
      <th><p>Namespace</p></th>
      <th><p>Labels</p></th>
    </tr>
  )
}

type Props = {
  deployments: Deployment[],
  isFetching: boolean
}