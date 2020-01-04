//@flow
import React, {Fragment} from 'react';
import type {Matching, WideDeployment} from "../../types/Types";
import Utils from "../../utils/Utils";
import { Micon, Text, Tables, TextOverLineSubtitle, ColoredLabelList } from "nectar-cs-js-common";
import S from './DeploymentListStyles'

function ListHeader() {
  return(
    <tr>
      <th><p>Deployment</p></th>
      <th><p>Found in</p></th>
      <th><Text.P2 left={1.8}>Git</Text.P2></th>
      <th><Text.P2 left={1.8}>Docker</Text.P2></th>
    </tr>
  )
}

function DeploymentItem(props: ItemProps) {
  const { isSelected, deployment, matching } = props;

  const YesIcon = () => <Micon n='check' emotion='success' left={1.75}/>;
  const NoIcon = () => <Micon n='close' emotion='idle' left={1.75}/>;
  const StatusIcon = ({name}) => ((matching || {})[name] ? <YesIcon/> : <NoIcon/>);
  const callback = () => props.callback(deployment.name);

  return(
    <S.Row focused={isSelected} onClick={callback}>
      <p>{deployment.name}</p>
      <ColoredLabelList labels={deployment.namespaces} labelType='blacklist'/>
      <StatusIcon name='gitRepoName'/>
      <StatusIcon name='imgRepoName'/>
    </S.Row>
  )
}

export default function DeploymentList(props: ListProps) {
  const text = "This wizard lets your tie deployments to their related git and image repos. " +
    "This is optional, and can be changed later.";

  const ListItems = () => (
    props.deployments.map((deployment, i) => (
      <DeploymentItem
        key={i}
        index={i}
        isSelected={i === props.selectedIndex}
        deployment={deployment}
        matching={Utils.depMatching(deployment.name, props.matchings)}
        callback={props.callback}
      />
    ))
  );

  return (
    <Fragment>
      <TextOverLineSubtitle text='Kubernetes Deployments'/>
      <p>{text}</p>
      <Tables.Table low={1.8}>
        <tbody>
        <ListHeader/>
        <ListItems/>
        </tbody>
      </Tables.Table>
    </Fragment>
  );
}

type ListProps = {
  matchings: Array<Matching>,
  deployments: Array<WideDeployment>,
  selectedIndex: number,
  callback: (string) => void
}

type ItemProps = {
  deployment: WideDeployment,
  matching: Matching,
  isSelected: boolean,
  callback: (string) => void
}
