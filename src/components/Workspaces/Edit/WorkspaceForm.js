//@flow

import React, {Fragment} from 'react'
import FormComponent from "../../../hocs/FormComponent";
import Utils from "../../../utils/Utils";
import type {Workspace} from "../../../types/Types";


class WorkspaceFormClass extends React.Component<Props> {
  render() {
    return (
      <Fragment>
        { this.renderNameInput() }
        { this.renderDefaultCheckbox() }
        { this.renderNamespaceFilters() }
        { this.renderFilterTypeSelect('ns') }
        { this.renderLabelFilters() }
        { this.renderFilterTypeSelect('lb') }
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
      "Filter Type",
      `${which}FilterType`,
      FILTER_TYPE_OPTIONS
    )
  }

  renderNamespaceFilters(){
    return this.props.makeTagPool(
      'Namespace Filters',
      'nsFilters',
      this.flesh(this.props.namespaceChoices)
    );
  }

  renderLabelFilters(){
    return this.props.makeTagPool(
      'Label Filters',
      'nsLabels',
      this.flesh(this.props.labelChoices)
    );
  }

  flesh(array: string[]): {string: string} {
    return array.reduce((w, c) => ({...w, [c]: c}), {});
  }
}

type Props = {
  ...Workspace,
  namespaceChoices: string[],
  labelChoices: string[]
}

const YES_NO_OPTIONS = Utils.hashOptions({
  true: "Yes",
  false: "No"
});

const FILTER_TYPE_OPTIONS = Utils.hashOptions({
  whitelist: "Whitelist",
  blacklist: "Blacklist"
});

const WorkspaceForm = FormComponent.compose(
  WorkspaceFormClass
);

export default WorkspaceForm;
