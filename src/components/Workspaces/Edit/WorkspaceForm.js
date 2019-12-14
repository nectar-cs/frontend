//@flow

import React, { Fragment } from 'react';
import ReactTags from 'react-tag-autocomplete';
import FormComponent from '../../../hocs/FormComponent';
import Utils from '../../../utils/Utils';
import ss from './../../../assets/react-tags.sass';
import s from './WorkspaceForm.sass';
import type { Workspace } from '../../../types/Types';

class WorkspaceFormClass extends React.Component<Props> {
  constructor(props) {
    super(props);
    this.onFilterAdded = this.onFilterAdded.bind(this);
    this.onFilterRemoved = this.onFilterRemoved.bind(this);
  }

  render() {
    return (
      <Fragment>
        {this.renderNameInput()}
        {this.renderDefaultCheckbox()}
        {this.renderNamespaceFilters()}
        {this.renderFilterTypeSelect('ns')}
        {this.renderLabelFilters()}
        {this.renderFilterTypeSelect('lb')}
      </Fragment>
    );
  }

  renderNameInput() {
    return this.props.makeInput('Workspace Name', 'name', 'e.g Data science apps');
  }

  renderDefaultCheckbox() {
    return this.props.makeSelect('Make Default', 'isDefault', YES_NO_OPTIONS);
  }

  renderFilterTypeSelect(which) {
    return this.props.makeSelect('Filter Type', `${which}FilterType`, FILTER_TYPE_OPTIONS);
  }

  renderNamespaceFilters() {
    return this.renderFilterSelect('Namespace Filters', 'namespaceChoices', 'nsFilters');
  }

  renderLabelFilters() {
    return this.renderFilterSelect('Label Filters', 'labelChoices', 'lbFilters');
  }

  renderFilterSelect(name, poolKey, currentOptionsKey) {
    return this.props.makeLine(name, [() => this.renderAutocomplete(poolKey, currentOptionsKey)]);
  }

  renderAutocomplete(poolKey, currentOptionsKey) {
    return (
      <ReactTags
        key={currentOptionsKey}
        minQueryLength={0}
        tags={this.tags(currentOptionsKey)}
        suggestions={this.suggestions(poolKey, currentOptionsKey)}
        handleDelete={t => this.onFilterRemoved(currentOptionsKey, t)}
        handleAddition={t => this.onFilterAdded(currentOptionsKey, t)}
        autofocus={false}
        classNames={AUTO_COMPLETE_STYLES}
      />
    );
  }

  onFilterAdded(currentChoicesKey, item) {
    const oldList = this.props[currentChoicesKey];
    const newList = [...oldList, item.name];
    this.manualBroadcast(currentChoicesKey, newList);
  }

  onFilterRemoved(currentChoicesKey, itemIndex) {
    const oldList = this.props[currentChoicesKey];
    const item = oldList[itemIndex];
    const newList = oldList.filter(e => e !== item);
    this.manualBroadcast(currentChoicesKey, newList);
  }

  suggestions(poolKey, currentChoicesKey) {
    const all = this.props[poolKey];
    const alreadyUsed = this.props[currentChoicesKey];
    const truncated = all.filter(choice => !alreadyUsed.includes(choice));
    return this.formatTags(truncated);
  }

  manualBroadcast(key, value) {
    this.props.notifyFormValueChanged(key, value);
  }

  tags(which) {
    return this.formatTags(this.props[which]);
  }

  formatTags(tags) {
    return tags.map(t => ({ id: t, name: t }));
  }
}

type Props = {
  ...Workspace,
  namespaceChoices: string[],
  labelChoices: string[],
};

const YES_NO_OPTIONS = Utils.hashOptions({
  true: 'Yes',
  false: 'No',
});

const FILTER_TYPE_OPTIONS = Utils.hashOptions({
  whitelist: 'Whitelist',
  blacklist: 'Blacklist',
});

const AUTO_COMPLETE_STYLES = {
  root: s.autoComplete,
  selected: ss.reactTagsSelected,
  selectedTag: ss.reactTagsSelectedTag,
  search: ss.reactTagsSearch,
  suggestions: ss.reactTagsSuggestions,
};

const WorkspaceForm = FormComponent.compose(WorkspaceFormClass);

export default WorkspaceForm;
