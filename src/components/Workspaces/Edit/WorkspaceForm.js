import React from 'react'
import PropTypes from 'prop-types'
import s from './WorkspaceForm.sass'
import ReactTags from 'react-tag-autocomplete';
import ss from './../../../assets/react-tags.sass'

const AUTO_COMPLETE_STYLES = {
  root: s.autoComplete,
  selected: ss.reactTagsSelected,
  selectedTag: ss.reactTagsSelectedTag,
  search: ss.reactTagsSearch,
  suggestions: ss.reactTagsSuggestions
};

export default class WorkspaceForm extends React.Component {

  constructor(props) {
    super(props);
    this.onFilterAdded = this.onFilterAdded.bind(this);
    this.onFilterRemoved = this.onFilterRemoved.bind(this);
    this.onFilterTypeChanged = this.onFilterTypeChanged.bind(this);
  }

  render() {
    return (
      <div className={s.form}>
        <div className={s.inputLine}>
          <p className={s.label}>Workspace Name</p>
          { this.renderNameInput() }
        </div>

        <div className={s.inputLine}>
          <p className={s.label}>Namespace Filter</p>
          { this.renderAutocomplete('namespaces') }
        </div>

        <div className={s.inputLine}>
          <p className={s.label}>Filter Method</p>
          { this.renderFilterTypeSelect() }
        </div>

        <div className={s.inputLine}>
          <p className={s.label}>Label Filter</p>
          { this.renderAutocomplete('labels') }
        </div>

        <div className={s.inputLine}>
          <p className={s.label}>Filter Method</p>
          { this.renderFilterTypeSelect() }
        </div>
      </div>
    )
  }

  renderNameInput(){
    const onChange = (e) => {
      this.props.onFieldsChanged({workspaceName: e.target.value})
    };

    return(
      <input
        value={this.props.workspaceName}
        onChange={onChange}
        className={s.textInput}
        placeholder='e.g Data science apps'
      />
    )
  }

  onFilterAdded(which, value){
    console.log("Add");
    console.log(which);
    console.log(value);

    const filters = [].concat(this.tags(which), value);
    const newBundle = {...this.props[which], filters};
    this.props.onFieldsChanged(newBundle);
  }

  onFilterRemoved(which, value){
    console.log("Delete");
    console.log(which);
    console.log(value)
  }

  tags(which){
    console.log("GOT");
    console.log(this.props);
    return this.props[which].filters;
  }

  suggestions(which) {
    const bundle = this.props[which];
    return bundle.possibilities.filter((poss) => (
      !bundle.filters.includes(poss)
    ));
  }

  renderAutocomplete(which) {
    return (
      <ReactTags
        key={which}
        minQueryLength={0}
        placeholder={`Filter by ${which}...`}
        tags={this.tags(which)}
        suggestions={this.suggestions(which)}
        handleDelete={() => this.onFilterRemoved(which)}
        handleAddition={(t) => this.onFilterAdded(which, t)}
        autofocus={false}
        classNames={AUTO_COMPLETE_STYLES}
      />
    );
  }

  renderFilterTypeSelect(which){
    const value = this.props[which];
    return(
      <select
        className={s.selectInput}
        value={value}
        onChange={this.onFilterTypeChanged}
      >
        <option>Whitelist</option>
        <option>Blacklist</option>
      </select>
    )
  }

  onFilterTypeChanged(e){
    console.log("Filter type changed");
    console.log(e);
  }

  static itemPropTypes = PropTypes.shape({
    filters: PropTypes.arrayOf(PropTypes.string).isRequired,
    filterType: PropTypes.string.isRequired,
    possibilities: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired;

  static propTypes = {
    onFieldsChanged: PropTypes.func.isRequired,
    workspaceName: PropTypes.string,
    namespaces: WorkspaceForm.itemPropTypes,
    labels:  WorkspaceForm.itemPropTypes
  }
}