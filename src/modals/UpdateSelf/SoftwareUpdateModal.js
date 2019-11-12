//@flow
import React, {Fragment} from 'react'
import FlexibleModal from "../../hocs/FlexibleModal";
import LeftHeader from "../../widgets/LeftHeader/LeftHeader";
import ModalButton from "../../widgets/Buttons/ModalButton";
import TextOverLineSubtitle from "../../widgets/TextOverLineSubtitle/TextOverLineSubtitle";
import Text from "../../assets/text-combos";
import Layout from "../../assets/layouts";
import Kapi from "../../utils/Kapi";
import CenterLoader from "../../widgets/CenterLoader/CenterLoader";
import CenterAnnouncement from "../../widgets/CenterAnnouncement/CenterAnnouncement";
import MiscUtils from "../../utils/MiscUtils";
import Backend from "../../utils/Backend";
import type {RevisionStatus} from "../../types/Types";
import ExplanationBlock from "./ExplanationBlock";
import Table from "./Table";

export default class SoftwareUpdateModal extends React.Component<Props, State> {

  constructor(props) {
    super(props);
    this.state = {
      isFetching: true,
      statuses: [],
      isSubmitting: false,
      isDone: false,
      checks: {},
    };
    this.submit = this.submit.bind(this);
  }

  async componentDidMount(){
    const { wasPrompted } = this.props;
    MiscUtils.mp("Software Update Start", {wasPrompted});
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
        text='Reload the app in 20 sec. Click here to close.'
        contentType='action'
        action={this.props.closeModal}
      />
    )
  }

  async fetchStatuses(){
    const frontend = MiscUtils.REVISION || '';
    const kapi = (await Kapi.bFetch('/api/status/revision'))['sha'];
    const payload = { currentVersions: { frontend, kapi } };
    let statuses = await Backend.bPost('/revisions/compare', payload);
    statuses = massageStatuses(statuses);
    const checks = this.computeDefaultChecks(statuses);
    this.setState(s => ({...s, isFetching: false, statuses, checks}));
  }

  async submit(){
    MiscUtils.mp("Software Update Submit", {});
    this.setState(s => ({...s, isSubmitting: true}));
    const ep = '/api/status/restart';
    const deployments = this.targetDepNames();
    await Kapi.blockingPost(ep, { deployments });
    this.setState(s => ({...s, isSubmitting: false, isDone: true}));
  }

  targetDepNames(){
    const { checks } = this.state;
    return Object.keys(checks).filter(k => checks[k]);
  }
  
  computeDefaultChecks(versions){
    return Object.keys(versions).reduce((h, k) => (
      { ...h, [versions[k].appName]: versions[k].updateNecessary }
    ), {});
  }

  changeCheck(which){
    this.setState(s => ({...s,
      checks: { ...s.checks, [which]: !s.checks[which] }
    }));
  }
}


function massageStatuses(statuses){
  if(isResultOk(statuses)){
    return statuses;
  } else {
    MiscUtils.senTrack("Bad statuses for revision")
  }
}

function genFallbackStatuses(){
  return APPS.map(appName => (
    { appName: appName, updateNecessary: false }
  ));
}

function isResultOk(statuses){
  try{
    const appNames = statuses.map(s => s.appName);
    return APPS.every(e => appNames.includes(e));
  } catch(e) {
    return false;
  }
}

type Props = {
  wasPrompted: boolean
}

type State = {
  statuses: RevisionStatus[],
  isFetching: boolean
}

const APPS = ['frontend', 'kapi'];