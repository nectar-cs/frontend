//@flow
import React, {Fragment} from 'react'
import S from './WorkspaceDepsPreviewStyles'
import { LeftHeader, Loader } from "nectar-cs-js-common";
import type {Deployment} from "../../../types/Types";

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
      title='Deployments'
      subtitle='Change the filters on the left side to see this update.'
    />
  );

  return (
    <Fragment>
      <Header/>
      <Loader.TopRightSpinner there={isFetching}/>
      <S.Table>
        <tbody>
        <DeploymentHeaderRow/>
        <DeploymentRows/>
        </tbody>
      </S.Table>
    </Fragment>
  )
}

function DeploymentRow(deployment: Deployment){
  const {name, namespace, labels} = deployment;

  const strLabels = Object.keys(labels || {}).map((k) => (
    `${k}:${(labels || {})[k]}`
  ));

  const LabelViews = () => strLabels.map((label) => (
    <S.StatusTag key={label}>{label}</S.StatusTag>
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
