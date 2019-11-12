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
          if (verdict) {
            props.openModal(
              SoftwareUpdateModal,
              { prompted: true }
            );
          }
        });
      }
      render() {
        return <Component {...this.props} />
      }
    };
  };
}