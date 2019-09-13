import React, {Fragment} from 'react'
import {S} from './DockerSectionStyles'
import TextOverLineSubtitle from "../../widgets/TextOverLineSubtitle/TextOverLineSubtitle";
import AddNew from "../../widgets/AddNew/AddNew";
import {ThemeProvider} from "styled-components";
import {theme} from "../../assets/constants";
import {InputLine, LineInput, SharedLineInput} from "../../assets/input-combos";
import defaults from "./defaults";
import Helper from "./Helper";

export default class DockerSection extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      showForm: true,
      vendor: null
    }
  }

  render(){
    return(
      <ThemeProvider theme={theme}>
        <Fragment>
          <TextOverLineSubtitle text='Image Registries'/>
          { this.renderAddNewButton() }
          { this.renderFormInputs() }
          { this.renderFormButtons() }
        </Fragment>
      </ThemeProvider>
    )
  }

  renderAddNewButton(){
    if(!this.state.showForm){
      const action = ()=> this.setState(s => ({...s, showForm: true}));
      return(
        <AddNew action={action}>
          <p>Add a docker account</p>
        </AddNew>
      )
    }
  }

  renderRegistryChoices(){
  }

  renderFormInputs(){
    if(this.state.showForm && this.state.vendor){
      return Helper.rendererForVendor(this.state.vendor);
    } else return null;
  }

  renderFormButtons(){
    if(this.state.showForm){
      const onCancel = () => this.setState(s => ({...s, showForm: false}));
      return(
        <S.FormButtonsRow>
          <S.CancelButton onClick={onCancel}>Cancel</S.CancelButton>
          { this.state.vendor ? <S.OkButton>Connect</S.OkButton> : null }
        </S.FormButtonsRow>
      )
    }
  }
}