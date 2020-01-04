import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import {S} from './IntegrationSectionStyles'
import defaults from "./defaults";
import Utils from "../../utils/Utils";
import { AddNew, Loader } from "nectar-cs-js-common";
import IntegrationList from "./IntegrationList";
import Backend from "../../utils/Backend";

export default class IntegrationSection extends React.PureComponent {

  constructor(props){
    super(props);
    this.state = {
      isSubmitting: false,
      isListFetching: true,
      isAuthUrlsFetching: true,
      registries: [],
      authUrls: []
    };
    this.formSubmit = null;
    this.onSubmitted = this.onSubmitted.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.fetchIntegrations = this.fetchIntegrations.bind(this);
  }

  componentDidMount(){
    Utils.mp("Integrations Start", {});
    this.props.setReloadPerformer(this.fetchIntegrations);
    this.fetchIntegrations();
    this.fetchAuthUrls();
  }

  render(){
    return(
      <Fragment>
        { this.renderList() }
        { this.renderAddNewButton() }
        { this.renderLoading() }
        { this.renderVendorChoices() }
        { this.renderFormInputs() }
        { this.renderFormButtons() }
      </Fragment>
    )
  }

  deleteItem({id, type, entity}){
    if (window.confirm(defaults.confirmDelete)) {
      this.setState(s => ({...s, isSubmitting: true}));
      this.performDelete(id, () => {
        Utils.mp('Integration Delete', {type, entity});
        this.setState(s => ({...s, isSubmitting: false}));
        this.fetchIntegrations();
      });
    }
  }

  renderList(){
    if(this.isBaseFetching()) return null;
    if(this.props.formShowing) return null;
    if(this.state.isSubmitting) return null;
    return <IntegrationList
      items={this.state.registries}
      requestDelete={this.deleteItem}
    />
  }

  renderLoading(){
    if(!this.state.isSubmitting && !this.isBaseFetching())
      return null;

    return(
      <S.LoadingLayout>
        <Loader.CenteredSpinner size='large'/>
        <S.LoadText>Working</S.LoadText>
      </S.LoadingLayout>
    )
  }

  renderAddNewButton(){
    if(this.isBaseFetching()) return null;
    if(this.props.formShowing) return null;
    if(this.state.isSubmitting) return null;

    const action = ()=> this.changeState({formShowing: true});
    return(
      <AddNew action={action}>
        <p>{this.newEntryCopy()}</p>
      </AddNew>
    )
  }

  renderVendorChoices(){
    if(this.isBaseFetching()) return null;
    if(!this.props.formShowing) return null;
    if(this.state.isSubmitting) return null;

    const make = (name) => () => this.changeState({vendor: name});
    const items = this.vendorList().map(vendor => (
      <S.Vendor
        key={vendor.name}
        onClick={make(vendor.name)}
        sel={vendor.name === this.props.vendor}
        src={Utils.frameworkImage(...vendor.image)}
      />
    ));

    return(
      <Fragment>
        <p>{this.vendorQuestion()}</p>
        <S.RegistriesRow>{items}</S.RegistriesRow>
      </Fragment>
    );
  }

  renderFormInputs(){
    if(this.isBaseFetching()) return null;
    if(this.state.isSubmitting) return null;

    const extras = {
      setSubmitPerformer: (func) => this.formSubmit = func,
      notifySubmitted: this.onSubmitted
    };

    if(this.props.formShowing && this.props.vendor){
      return this.formRenderer(extras);
    } else return null;
  }

  renderFormButtons(){
    if(this.isBaseFetching()) return null;
    if(!this.props.formShowing) return null;
    if(this.state.isSubmitting) return null;

    const onCancel = () => this.changeState({formShowing: false});
    const onOk = () => {
      this.setState(s => ({...s, isSubmitting: true}));
      this.formSubmit();
    };

    const OkButton = ()=> <S.OkButton onClick={onOk}>Connect</S.OkButton>;

    return(
      <S.FormButtonsRow>
        <S.CancelButton onClick={onCancel}>Cancel</S.CancelButton>
        { this.props.vendor && <OkButton/> }
      </S.FormButtonsRow>
    )
  }

  fetchIntegrations(){
    this.setState(s => ({...s, registries: [], isListFetching: true}));
    this.performFetch((registries) => {
      this.setState(s => ({...s, registries, isListFetching: false}));
      registries.forEach(r => this.startConnectionCheck(r.id));
    })
  }

  fetchAuthUrls(){
    this.setState(s => ({...s, isAuthUrlsFetching: true}));
    this.performAuthUrlsFetch((authUrls) => {
      this.setState(s => ({...s, authUrls, isAuthUrlsFetching: false}));
    })
  }

  performConnectionCheck(id, whenDone){
    const ep = `/remotes/${id}/check_connection`;
    Backend.aFetch(ep, resp => {
      whenDone(resp['data']['connected']);
    })
  }

  performDelete(id, whenDone){
    const endpoint = `/remotes/${id}`;
    Backend.raisingDelete(endpoint, whenDone);
  }

  startConnectionCheck(id){
    this.performConnectionCheck(id, result => {
      const news = this.state.registries.map(r => {
        if(r.id.toString() === id.toString()){
          return {...r, connected: result};
        } else return r;
      });
      this.setState(s => ({...s, registries: news}));
    });
  }

  changeState(assignment){
    this.props.setMasterState(assignment);
  }

  onSubmitted(){
    this.changeState({formShowing: false});
    this.setState(s => ({...s, isSubmitting: false}));
    this.props.notifyDataChanged();
    this.fetchIntegrations();
  }

  isBaseFetching(){
    const { isAuthUrlsFetching, isListFetching } = this.state;
    return isAuthUrlsFetching || isListFetching;
  }

  static propTypes = {
    setReloadPerformer: PropTypes.func.isRequired,
    vendor: PropTypes.string,
    formShowing: PropTypes.oneOf([true, false]).isRequired,
    setMasterState: PropTypes.func.isRequired,
    notifyDataChanged: PropTypes.func.isRequired
  }
}
