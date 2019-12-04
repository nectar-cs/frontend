import React, { Fragment } from 'react';
import ModalHelper from '../utils/ModalHelper';
import Modal from 'react-modal';
import { setModalOps } from '../actions/action';
import { connect } from 'react-redux';
Modal.defaultStyles.overlay.backgroundColor = 'rgba(49, 54, 72, 0.8)';

function d2P(dispatch) {
  return {
    setModalOps: a => dispatch(setModalOps(a)),
  };
}

export default class ModalHostComposer {
  static compose(WrappedComponent) {
    class Aug extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          modalClass: null,
          modalProps: {},
        };
        this.escFunction = this.escFunction.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.timedClose = this.timedClose.bind(this);
        this.replaceModal = this.replaceModal.bind(this);
      }

      componentDidMount() {
        this.props.setModalOps(this.openModal, this.closeModal);
        document.addEventListener('keydown', this.escFunction, false);
      }

      componentWillUnmount() {
        document.removeEventListener('keydown', this.escFunction, false);
      }

      render() {
        return (
          <Fragment>
            {this.renderModal()}
            <WrappedComponent
              openModal={this.openModal}
              closeModal={this.closeModal}
              replaceModal={this.replaceModal}
              {...this.props}
            />
          </Fragment>
        );
      }

      openModal(modalClass, modalProps = {}) {
        this.setState(s => ({ ...s, modalClass, modalProps }));
      }

      closeModal() {
        this.setState(s => ({ ...s, modalClass: null }));
        const onClose = this.state.modalProps.onClosed;
        onClose && onClose();
      }

      replaceModal(modalClass, modalProps) {
        this.closeModal();
        this.openModal(modalClass, modalProps);
      }

      renderModal() {
        if (!this.state.modalClass) return null;
        const ModalContentComponent = this.state.modalClass;
        return (
          <Modal
            isOpen={true}
            onRequestClose={() => {
              this.closeModal();
            }}
            ariaHideApp={false}
            style={ModalHelper.customStyles()}
          >
            <ModalContentComponent
              onRequestClose={this.closeModal}
              closeModal={this.closeModal}
              replaceModal={this.replaceModal}
              timedClose={this.timedClose}
              {...this.state.modalProps}
            />
          </Modal>
        );
      }

      timedClose() {
        let anchor = this;
        setTimeout(
          function() {
            anchor.closeModal();
          }.bind(this),
          500,
        );
      }

      escFunction(event) {
        if (event.keyCode === 27) this.closeModal();
      }
    }

    return connect(null, d2P)(Aug);
  }
}
