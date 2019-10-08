import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import FormComponent from "../../hocs/FormComponent";
import MiscUtils from "../../utils/MiscUtils";

class CommandFormClass extends React.Component {
  render(){
    return(
      <Fragment>
        { this.renderPodSelect() }
        { this.renderCommandInput() }
      </Fragment>
    )
  }

  renderPodSelect(){
    const podNames = this.props.podNameOptions;
    return this.props.makeSelect(
      "Target Pod",
      "podName",
      MiscUtils.arrayOptions(podNames)
    );
  }

  renderCommandInput(){
    return this.props.makeInput(
      "Command",
      "command",
      "e.g python manage.py"
    );
  }

  static propTypes = {
    podName: PropTypes.string,
    command: PropTypes.string,
    podNameOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  }
}


const CommandForm = FormComponent.compose(
  CommandFormClass
);

export default CommandForm;