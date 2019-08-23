import React, {Fragment} from "react";
import PropTypes from 'prop-types';
import ModalHelper from "../utils/ModalHelper";
import Modal from "react-modal";
Modal.defaultStyles.overlay.backgroundColor = "rgba(49, 54, 72, 0.6)";

export default class ModalHostComposer{

  static compose(WrappedComponent){
    return class extends React.Component {

      constructor(props){
        super(props);
        this.state = {
          modalClass: null
        };
        this.escFunction = this.escFunction.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.timedClose = this.timedClose.bind(this);
      }

      render(){
        return(
          <Fragment>
            { this.renderModal() }
            <WrappedComponent
              openModal={this.openModal}
              onRequestClose={this.closeModal}
              closeModal={this.closeModal}
              {...this.props}
            />
          </Fragment>
        )
      }

      openModal(modalClass, data=null){
        this.setState((s) => {
          return {...s, modalClass};
        });
      }

      closeModal(){
        this.setState((s) => ({...s, modalClass: null}));
      }

      renderModal(record){
        if(!this.state.modalClass) return null;

        let Actual = this.state.modalClass;

        let data = {
          onRequestClose: this.closeModal,
          closeModal: this.closeModal,
          timedClose: this.timedClose
        };

        return(
          <Modal
            isOpen={true}
            onRequestClose={() => {this.closeModal()}}
            ariaHideApp={false}
            style={ModalHelper.customStyles()}>
            <Actual {...data}/>
          </Modal>
        )
      }

      timedClose(){
        let anchor = this;
        setTimeout(function() {
          anchor.closeModal();
        }.bind(this), 500);
      }

      escFunction(event){
        if(event.keyCode === 27) this.closeModal();
      }

      componentDidMount(){
        document.addEventListener("keydown", this.escFunction, false);
      }

      componentWillUnmount(){
        document.removeEventListener("keydown", this.escFunction, false);
      }
    }
  }
}