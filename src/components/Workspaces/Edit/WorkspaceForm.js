import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import s from './WorkspaceForm.sass'
import ReactTags from 'react-tag-autocomplete';
import ss from './../../../assets/react-tags.sass'
import FormComponent from "../../../hocs/FormComponent";
import MiscUtils from "../../../utils/MiscUtils";
import type {Workspace} from "../../../types/Types";

class WorkspaceFormClass extends React.Component<Props> {

  constructor(props) {
    super(props);
    this.onFilterAdded = this.onFilterAdded.bind(this);
    this.onFilterRemoved = this.onFilterRemoved.bind(this);
  }

  render() {
    return (
      <Fragment>
        { this.renderNameInput() }
        { this.renderDefaultCheckbox() }
        { this.renderFilterTypeSelect('ns') }
        { this.renderFilterTypeSelect('lb') }

        {/*<div className={s.inputLine}>*/}
        {/*  <p className={s.label}>Namespace Filter</p>*/}
        {/*  { this.renderAutocomplete('namespaces') }*/}
        {/*</div>*/}

        {/*<div className={s.inputLine}>*/}
        {/*  <p className={s.label}>Label Filter</p>*/}
        {/*  { this.renderAutocomplete('labels') }*/}
        {/*</div>*/}
      </Fragment>
    )
  }

  renderNameInput(){
    return this.props.makeInput(
      "Workspace Name",
      "name",
      "e.g Data science apps"
    )
  }

  renderDefaultCheckbox(){
    return this.props.makeSelect(
      "Make Default",
      "isDefault",
      YES_NO_OPTIONS
    );
  }

  renderFilterTypeSelect(which){
    return this.props.makeSelect(
      "Filter type",
      `${which}FilterType`,
      FILTER_TYPE_OPTIONS
    )
  }

  onFilterAdded(which, value){
    const bundle = this.props[which];
    const filters = [].concat(bundle.filters, value.name);
    const newBundle = {...bundle, filters};
    this.props.onFieldsChanged({[which]: newBundle});
  }

  onFilterRemoved(which, i){
    const bundle = this.props[which];
    let filters = bundle.filters.filter(f => f !== bundle.filters[i]);
    const newBundle = {...bundle, filters};
    this.props.onFieldsChanged({[which]: newBundle});
  }

  tags(which){
    return this.rinseTags(this.props[which].filters);
  }

  rinseTags(tags){
    return tags.map((t) => (
      { id: t, name: t }
    ));
  }

  suggestions(which) {
    const bundle = this.props[which];
    const truncated = bundle.possibilities.filter((poss) => (
      !bundle.filters.includes(poss)
    ));
    return this.rinseTags(truncated);
  }

  renderAutocomplete(which) {
    return (
      <ReactTags
        key={which}
        minQueryLength={0}
        placeholder={`Filter by ${which}...`}
        tags={this.tags(which)}
        suggestions={this.suggestions(which)}
        handleDelete={(t) => this.onFilterRemoved(which, t)}
        handleAddition={(t) => this.onFilterAdded(which, t)}
        autofocus={false}
        classNames={AUTO_COMPLETE_STYLES}
      />
    );
  }

  onFilterTypeChanged(which, filterType){
    const bundle = this.props[which];
    const newBundle = {...bundle, filterType};
    this.props.onFieldsChanged({[which]: newBundle});
  }

  onIsDefaultChanged(value){
    this.props.onFieldsChanged({isDefault: value});
  }

  static itemPropTypes = PropTypes.shape({
    filters: PropTypes.arrayOf(PropTypes.string).isRequired,
    filterType: PropTypes.string.isRequired,
    possibilities: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired;
}

type Props = {
  ...Workspace,
  namespaceChoices: string[],
  labelChoices: string[]
}

const YES_NO_OPTIONS = MiscUtils.hashOptions({
  true: "Yes",
  false: "No"
});

const FILTER_TYPE_OPTIONS = MiscUtils.hashOptions({
  whitelist: "Whitelist",
  blacklist: "Blacklist"
});

const AUTO_COMPLETE_STYLES = {
  root: s.autoComplete,
  selected: ss.reactTagsSelected,
  selectedTag: ss.reactTagsSelectedTag,
  search: ss.reactTagsSearch,
  suggestions: ss.reactTagsSuggestions
};

const WorkspaceForm = FormComponent.compose(
  WorkspaceFormClass
);

export default WorkspaceForm;
