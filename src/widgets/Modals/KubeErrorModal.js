import React from 'react'
import PropTypes from 'prop-types'
import s from './KubeErrorModal.sass'
import {LeftHeader} from "../LeftHeader/LeftHeader";
import MiscUtils from "../../utils/MiscUtils";
import ModalButton from "../Buttons/ModalButton";
import KubeHandler from "../../utils/KubeHandler";
import {KapiErrorContent, kapiErrorTitle} from "../../misc/KubeErrorContent";

export default class KubeErrorModal extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      isSubmitting: false,
      didConnect: false,
      bundle: null
    };
    this.submitRetry = this.submitRetry.bind(this);
    this.onConnectSuccess = this.onConnectSuccess.bind(this);
    this.onConnectFailed = this.onConnectFailed.bind(this);
  }

  componentWillReceiveProps(nextProps){
    this.setState(s => ({...s, bundle: nextProps.bundle}));
  }

  render(){
    return(
      <div className={s.modal}>
        <LeftHeader
          title={kapiErrorTitle(this.bundle())}
          subtitle={"Mo' Kubernetes, mo' problems, right?"}
          graphicType='image'
          graphicName={MiscUtils.image('k8s_style_light.png')}
        />

        <div className={s.content}>
          <KapiErrorContent {...this.bundle()} />
        </div>

        <ModalButton
          title={'Try Reconnecting'}
          callback={this.submitRetry}
          isEnabled={!this.state.isSubmitting && !this.state.didConnect}
        />

      </div>
    );
  }

  onConnectSuccess(){
    this.setState(s => ({...s, isSubmitting: false, didConnect: true}));
    this.props.timedClose();
  }

  onConnectFailed(bundle){
    this.setState((s) => ({...s, bundle, isSubmitting: false}));
  }

  submitRetry(){
    const endpoint = `/api/status/connect`;
    KubeHandler.raisingFetch(
      endpoint,
      this.onConnectSuccess,
      this.onConnectFailed
    )
  }

  bundle(){
    return this.state.bundle || this.props.bundle;
  }

  static propTypes = {
    bundle: PropTypes.shape({
      kind: PropTypes.oneOf(['soft', 'hard']).isRequired,
      error: PropTypes.object.isRequired
    }).isRequired
  }
}
