import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import FormComponent from "../../hocs/FormComponent";
import MiscUtils from "../../utils/MiscUtils";

class PortForwardFormClass extends React.Component{

  constructor(props){
    super(props);
    this.makeSelect = props.makeSelect;
    this.makeInput = props.makeInput;
  }

  render(){
    return(
      <Fragment>
        { this.renderResTypeSelect() }
        { this.renderResNameSelect() }
        { this.renderFromPortInput() }
      </Fragment>
    )
  }

  renderResTypeSelect(){
    return this.makeSelect(
      "Resource Type",
      "resType",
      MiscUtils.arrayOptions(this.props.resTypeOptions)
    )
  }

  renderResNameSelect(){
    return this.makeSelect(
      "Resource",
      "resName",
      MiscUtils.arrayOptions(this.props.resNameOptions)
    )
  }

  renderFromPortInput(){
    return this.makeInput(
      "From Port",
      "fromPort"
    )
  }

  static propTypes = {
    resType: PropTypes.string,
    resTypeOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
    resName: PropTypes.string,
    resNameOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
    fromPort: PropTypes.string
  }
}

const PortForwardForm = FormComponent.compose(PortForwardFormClass);
export default PortForwardForm;