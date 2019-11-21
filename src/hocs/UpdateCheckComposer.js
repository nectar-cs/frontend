import React from 'react'
import UpdateChecker from "../utils/UpdateChecker";
import SoftwareUpdateModal from "../modals/SoftwareUpdateModal/SoftwareUpdateModal";

export default class UpdateCheckComposer {
  static compose(Component){
    return class extends React.Component {
      async componentDidMount() {
        const props = this.props;
        const checker = new UpdateChecker();
        if(await checker.perform())
          props.openModal(SoftwareUpdateModal, { prompted: true });
      }
      render() {
        return <Component {...this.props} />
      }
    };
  };
}