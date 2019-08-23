import React, {Fragment} from "react";
import Modal from "react-modal";
import KubeErrorModal from "../widgets/Modals/KubeErrorModal";

Modal.defaultStyles.overlay.backgroundColor = "rgba(49, 54, 72, 0.6)";

export default class ErrComponent{

  static compose(WrappedComponent){

    return class extends React.Component {

      constructor(props){
        super(props);
        this.state = {
          hasKubeError: false,
          error: null
        };
        this.kubeErrorCallback = this.kubeErrorCallback.bind(this);
      }

      render(){
        return(
          <Fragment>
            { this.renderNormalView() }
          </Fragment>
        )
      }

      renderNormalView(){
        return(
          <WrappedComponent
            kubeErrorCallback={this.kubeErrorCallback}
            hasKubeError={this.state.hasKubeError}
            {...this.props}
          />
        )
      }

      kubeErrorCallback(error){
        this.setState((s) => ({...s, error, hasKubeError: true}));
        this.props.openModal(KubeErrorModal)
      }
    };
  }



}