import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import TextOverLineSubtitle from "../../widgets/TextOverLineSubtitle/TextOverLineSubtitle";
import FormComponent from "../../hocs/FormComponent";
import MiscUtils from "../../utils/MiscUtils";
import defaults from "./defaults";

class ExpectationsFormClass extends React.Component{
  render(){
    return(
      <Fragment>
        <TextOverLineSubtitle text='Expectations'/>
        { this.renderServiceSelector() }
        { this.renderOriginSelector() }
      </Fragment>
    )
  }

  renderServiceSelector(){
    const { makeSelect, serviceChoices } = this.props;
    return makeSelect(
      "Trying to connect via service",
      "service",
      MiscUtils.arrayOptions(serviceChoices)
    )
  }

  renderOriginSelector(){
    return this.props.makeSelect(
      "From ",
      "origin",
      ExpectationsFormClass.originOptions()
    )
  }

  static originOptions(){
    return MiscUtils.hashOptions(defaults.form.origins)
  }

  static propTypes = {
    service: PropTypes.string.isRequired,
    origin: PropTypes.string.isRequired,
    serviceChoices: PropTypes.arrayOf(
      PropTypes.string
    ).isRequired
  }
}

const ExpectationsForm = FormComponent.compose(
  ExpectationsFormClass
);
export default ExpectationsForm;