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
import CenterLoader from "../../widgets/CenterLoader/CenterLoader";
import {CenteredSpinner, ModSpinner} from "../../assets/loading-spinner";

export default class DockerSection extends React.PureComponent {

  constructor(props){
    super(props);
    this.state = { isSubmitting: false };
    this.formSubmit = null;
    this.onSubmitted = this.onSubmitted.bind(this);
  }
  
  changeState(assignment){
    this.props.setDockerState(assignment);
  }

  onSubmitted(){
    this.setState(s => ({...s, isSubmitting: false}));
    this.changeState({showingForm: false});
  }

  render(){
    return(
      <ThemeProvider theme={theme}>
        <Fragment>
          <TextOverLineSubtitle text='Image Registries'/>
          { this.renderAddNewButton() }
          { this.renderLoading() }
          { this.renderVendorChoices() }
          { this.renderFormInputs() }
          { this.renderFormButtons() }
        </Fragment>
      </ThemeProvider>
    )
  }

  renderLoading(){
    if(!this.state.isSubmitting) return null;
    return(
      <S.LoadingLayout>
        <CenteredSpinner size='large'/>
        <S.LoadText>Saving</S.LoadText>
      </S.LoadingLayout>
    )
  }

  renderAddNewButton(){
    if(this.props.formShowing) return null;
    if(this.state.isSubmitting) return null;
    
    const action = ()=> this.changeState({formShowing: true});
    return(
      <AddNew action={action}>
        <p>Add a docker account</p>
      </AddNew>
    )
  }

  renderVendorChoices(){
    if(!this.props.formShowing) return null;
    if(this.state.isSubmitting) return null;

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
        <p>{defaults.vendorQuestion}</p>
        <S.RegistriesRow>{items}</S.RegistriesRow>
      </Fragment>
    );
  }

  renderFormInputs(){
    if(this.state.isSubmitting) return null;

    const props = {
      setSubmitPerformer: (func) => this.formSubmit = func,
      notifySubmitted: this.onSubmitted
    };

    if(this.props.formShowing && this.props.vendor){
      return Helper.rendererForVendor(
        this.props.vendor,
        props
      );
    } else return null;
  }

  renderFormButtons(){
    if(!this.props.formShowing) return null;
    if(this.state.isSubmitting) return null;
    
    const onCancel = () => this.changeState({formShowing: false});
    const onOk = this.formSubmit;

    const OkButton = ()=> <S.OkButton onClick={onOk}>Connect</S.OkButton>;

    return(
      <S.FormButtonsRow>
        <S.CancelButton onClick={onCancel}>Cancel</S.CancelButton>
        { this.props.vendor && <OkButton/> }
      </S.FormButtonsRow>
    )
  }

  static propTypes = {
    vendor: PropTypes.string.isRequired,
    formShowing: PropTypes.oneOf([true, false]).isRequired,
    setDockerState: PropTypes.func.isRequired
  }
}