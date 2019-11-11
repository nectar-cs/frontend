import React from 'react'
import UpdateChecker from "../utils/UpdateChecker";
import SoftwareUpdateModal from "../modals/UpdateSelf/SoftwareUpdateModal";

export default class UpdateCheckComposer {
  static compose(Component){
    return class extends React.Component {
      componentDidMount() {
        const props = this.props;
        const checker = new UpdateChecker();
        checker.perform().then(verdict => {
          // if (verdict) {
          //   const { bundle } = verdict;
          //   props.openModal(SoftwareUpdateModal, { bundle });
          // }
          props.openModal(SoftwareUpdateModal);
        });
      }
      render() {
        return <Component {...this.props} />
      }
    };
  };
}