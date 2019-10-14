import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import TextOverLineSubtitle from "../../widgets/TextOverLineSubtitle/TextOverLineSubtitle";
import FormComponent from "../../hocs/FormComponent";
import MiscUtils from "../../utils/MiscUtils";
import defaults from "./defaults";
import S from './MiscStyles'

class ExpectationsFormClass extends React.Component{
  render(){
    return(
      <Fragment>
        <TextOverLineSubtitle text='Expectations'/>
        { this.renderServiceSelector() }
        { this.renderPortSelector() }
        { this.renderOriginSelector() }
        { this.renderButton() }
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

  renderPortSelector(){
    const { makeSelect, portChoices } = this.props;
    return makeSelect(
      "Through port ",
      "port",
      MiscUtils.arrayOptions(portChoices)
    )
  }

  renderButton(){
    return(
      <S.BeginButton onClick={this.props.beginCallback}>
        Begin
      </S.BeginButton>
    )
  }

  static originOptions(){
    return MiscUtils.hashOptions(defaults.form.origins)
  }

  static propTypes = {
    service: PropTypes.string.isRequired,
    origin: PropTypes.string.isRequired,
    beginCallback: PropTypes.func.isRequired,
    serviceChoices: PropTypes.arrayOf(
      PropTypes.string
    ).isRequired,
    portChoices: PropTypes.arrayOf(
      PropTypes.string
    ).isRequired
  }
}

const ExpectationsForm = FormComponent.compose(
  ExpectationsFormClass
);
export default ExpectationsForm;