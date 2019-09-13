import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import {S} from './DockerSectionStyles'
import TextOverLineSubtitle from "../../widgets/TextOverLineSubtitle/TextOverLineSubtitle";
import AddNew from "../../widgets/AddNew/AddNew";
import {ThemeProvider} from "styled-components";
import {theme} from "../../assets/constants";
import defaults from "./defaults";
import Helper from "./Helper";
import MiscUtils from "../../utils/MiscUtils";

export default class DockerSection extends React.PureComponent {

  changeState(assignment){
    this.props.setDockerState(assignment);
  }

  render(){
    return(
      <ThemeProvider theme={theme}>
        <Fragment>
          <TextOverLineSubtitle text='Image Registries'/>
          { this.renderAddNewButton() }
          { this.renderVendorChoices() }
          { this.renderFormInputs() }
          { this.renderFormButtons() }
        </Fragment>
      </ThemeProvider>
    )
  }

  renderAddNewButton(){
    if(!this.props.showForm){
      const action = ()=> this.changeState({showForm: true});
      return(
        <AddNew action={action}>
          <p>Add a docker account</p>
        </AddNew>
      )
    }
  }

  renderVendorChoices(){
    if(!this.props.showForm) return null;

    const make = (name) => () => this.changeState({vendor: name});
    const items = defaults.vendors.map(vendor => (
      <S.Vendor
        key={vendor.name}
        onClick={make(vendor.name)}
        sel={vendor.name === this.props.vendor}
        src={MiscUtils.frameworkImage(...vendor.image)}
      />
    ));

    return(
      <Fragment>
        <p>Where are your docker images?</p>
        <S.RegistriesRow>{items}</S.RegistriesRow>
      </Fragment>
    );
  }

  renderFormInputs(){
    if(this.props.showForm && this.props.vendor){
      return Helper.rendererForVendor(this.props.vendor);
    } else return null;
  }

  renderFormButtons(){
    if(this.props.showForm){
      const onCancel = () => this.changeState({showForm: false});
      return(
        <S.FormButtonsRow>
          <S.CancelButton onClick={onCancel}>Cancel</S.CancelButton>
          { this.props.vendor ? <S.OkButton>Connect</S.OkButton> : null }
        </S.FormButtonsRow>
      )
    }
  }

  static propTypes = {
    vendor: PropTypes.string.isRequired,
    showForm: PropTypes.oneOf([true, false]).isRequired,
    setDockerState: PropTypes.func.isRequired
  }
}