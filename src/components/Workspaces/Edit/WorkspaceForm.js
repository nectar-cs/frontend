//@flow

import React, {Fragment} from 'react'
import FormComponent from "../../../hocs/FormComponent";
import Utils from "../../../utils/Utils";
import type {Workspace} from "../../../types/Types";
import TagPool from "../../../widgets/TagPool/TagPool";


class WorkspaceFormClass extends React.Component<Props> {

  constructor(props) {
    super(props);
  }

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
    return this.renderFilterSelect(
      'Namespace Filters',
      'namespaceChoices',
      'nsFilters'
    );
  }

  renderLabelFilters(){
    return this.renderFilterSelect(
      'Label Filters',
      'labelChoices',
      'lbFilters'
    );
  }

  renderFilterSelect(name, poolKey, currentOptionsKey){
    return this.props.makeTagPool(
      "Hey",
      "asdasd",
      []
    )
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
