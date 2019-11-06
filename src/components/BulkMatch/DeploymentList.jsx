//@flow
import React from 'react';
import s from './DeploymentList.sass'
import TextOverLineSubtitle from "../../widgets/TextOverLineSubtitle/TextOverLineSubtitle";
import type {Matching, WideDeployment} from "../../types/Types";
import Micon from "../../widgets/Micon/Micon";
import MiscUtils from "../../utils/MiscUtils";

function ListHeader() {
  return(
    <tr>
      <th><p>Deployment</p></th>
      <th><p>Found in</p></th>
      <th><p className={s.checkHead}>Git</p></th>
      <th><p className={s.checkHead}>Docker</p></th>
    </tr>
  )
}

function DeploymentItem(props: ItemProps) {
  const { isSelected, deployment, matching } = props;

  const NamespaceTags = () => deployment.namespaces.map(ns => (
    <p key={ns} className={s.nsTag}>{ns}</p>
  ));

  const YesIcon = () => <Micon n='check' e='success' extras={"margin-left: 22px"}/>;
  const NoIcon = () => <Micon n='close' e='idle' extras={"margin-left: 22px"}/>;
  const StatusIcon = ({name}) => ((matching || {})[name] ? <YesIcon/> : <NoIcon/>);
  const callback = () => props.callback(deployment.name);

  return(
    <tr className={isSelected ? s.focusedRow : s.row} onClick={callback}>
      <td><p>{deployment.name}</p></td>
      <td><NamespaceTags/></td>
      <td><StatusIcon name='gitRepoName'/></td>
      <td><StatusIcon name='imgRepoName'/></td>
    </tr>
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
        matching={MiscUtils.depMatching(deployment.name, props.matchings)}
        callback={props.callback}
      />
    ))
  );

  return (
    <div className={s.deploymentList}>
      <TextOverLineSubtitle text='Kubernetes Deployments'/>
      <p>{text}</p>
      <table className={s.mainTable}>
        <tbody>
        <ListHeader/>
        <ListItems/>
        </tbody>
      </table>
    </div>
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