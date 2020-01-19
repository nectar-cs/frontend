//@flow
import React, {Fragment} from 'react'
import FlexibleModal from "../../hocs/FlexibleModal";
import { CenterLoader, CenterAnnouncement, Layout, LeftHeader, ModalButton, Text, TextOverLineSubtitle } from "nectar-cs-js-common";
import Kapi from "../../utils/Kapi";
import Utils from "../../utils/Utils";
import Central from "../../utils/Central";
import type {RevisionStatus} from "../../types/Types";
import ExplanationBlock from "./ExplanationBlock";
import Table from "./Table";
import Helper from './Helper'
import Backend from "../../utils/Backend";

export default class SoftwareUpdateModal extends React.Component<Props, State> {

  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      statuses: [],
      isSubmitting: false,
      isDone: false,
      checks: {},
    };
    this.submit = this.submit.bind(this);
  }

  async componentDidMount(){
    const { wasPrompted } = this.props;
    Utils.mp("Software Update Start", {wasPrompted});
    this.fetchStatuses();
  }

  render(){
    return(
      <FlexibleModal mode='modal'>
        { this.renderHeader() }
        { this.renderLoading() }
        { this.renderExplanation() }
        { this.renderGamePlan() }
        { this.renderBreakdown() }
        { this.renderButton() }
        { this.renderLoader() }
        { this.renderDone() }
      </FlexibleModal>
    )
  }

  renderLoading(){
    if(!this.state.isFetching) return null;
    return <CenterLoader/>;
  }

  renderHeader(){
    return(
      <LeftHeader
        graphicName='cached'
        graphicType='icon'
        title='Mosaic Self Update'
        subtitle="Let me become my ultimate self"
      />
    )
  }

  renderBreakdown(){
    const { statuses, isSubmitting, isDone, checks } = this.state;
    if(statuses == null) return null;
    if(isSubmitting || isDone || statuses.length < 1) return null;

    const Rows = () => statuses.map(status => (
      <Table.AppRow
        key={status.appName}
        status={status}
        isChecked={checks[status.appName]}
        callback={() => this.changeCheck(status.appName)}
      />
    ));

    return(
      <Fragment>
        <TextOverLineSubtitle text="Mosaic's Deployments"/>
        <table>
          <tbody>
            <Table.HeaderRow/>
            <Rows/>
          </tbody>
        </table>
      </Fragment>
    )
  }

  renderExplanation(){
    const { isFetching, isSubmitting, isDone } = this.state;
    if(isSubmitting || isDone || isFetching) return null;
    return <ExplanationBlock/>;
  }

  renderGamePlan(){
    const { isFetching, isSubmitting, isDone } = this.state;
    if(isSubmitting || isDone || isFetching) return null;

    const exp = this.targetDepNames().join(', ');
    const deleteCmd = `kubectl delete pod -l 'app in (${exp})' -n nectar`;
    const watchCmd = `kubectl get pod -n nectar -w`;

    return(
      <Fragment>
        <Layout.BigCodeViewer>
          <Text.Code>{deleteCmd}</Text.Code>
          <Text.Code>{watchCmd}</Text.Code>
        </Layout.BigCodeViewer>
      </Fragment>
    )
  }

  renderLoader(){
    const { isSubmitting, isDone } = this.state;
    if(!isSubmitting || isDone) return null;
    return <CenterLoader/>;
  }

  renderButton(){
    const { isSubmitting, isDone, checks } = this.state;
    if(isSubmitting || isDone) return null;
    const areAnyMarked = Object.values(checks).includes(true);

    return(
      <ModalButton
        isEnabled={areAnyMarked}
        callback={this.submit}
        title='Update'
      />
    )
  }

  renderDone(){
    if(!this.state.isDone) return null;
    return(
      <CenterAnnouncement
        iconName='av_timer'
        contentType='children'>
        <Text.P>In 15 seconds, <b>hard-reload</b> the page</Text.P>
        <Text.P>That's <b>CTRL + SHIFT + R</b> on Chrome/FireFox</Text.P>
      </CenterAnnouncement>
    )
  }

  async fetchStatuses(){
    this.setState(s => ({...s, isFetching: true}));
    const frontend = Utils.REVISION || '';
    const kapi = ((await Kapi.bFetch('/api/status/revision')) || {})['sha'];
    const backend = ((await Backend.bFetch('/status/revision')) || {})['sha'];
    const payload = { currentVersions: { frontend, kapi, backend } };
    const answer = await Central.bPost('/revisions/compare', payload);
    const statuses = Helper.massageStatuses(answer);
    const checks = Helper.computeDefaultChecks(statuses);
    this.setState(s => ({...s, isFetching: false, statuses, checks}));
  }

  async submit(){
    Utils.mp("Software Update Submit", {});
    this.setState(s => ({...s, isSubmitting: true}));
    const ep = '/api/status/restart';
    const deployments = this.targetDepNames();
    await Kapi.bPost(ep, { deployments });
    this.setState(s => ({...s, isSubmitting: false, isDone: true}));
  }

  targetDepNames(){
    const { checks } = this.state;
    return Object.keys(checks).filter(k => checks[k]);
  }

  changeCheck(which){
    this.setState(s => ({...s,
      checks: { ...s.checks, [which]: !s.checks[which] }
    }));
  }
}

type Props = { wasPrompted: boolean };

type State = {
  statuses: RevisionStatus[],
  isFetching: boolean
};
