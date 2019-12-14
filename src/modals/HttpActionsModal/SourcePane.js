import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import ReactTags from 'react-tag-autocomplete';
import ss from '../../assets/react-tags.sass';
import Utils from '../../utils/Utils';
import ComingSoonSection from '../../widgets/ComingSoonSection/ComingSoonSection';
import s from './SourcePane.sass';

const AUTO_COMPLETE_STYLES = {
  root: s.labelTags,
  selected: ss.reactTagsSelected,
  selectedTag: ss.reactTagsSelectedTag,
  search: ss.reactTagsSearch,
  suggestions: ss.reactTagsSuggestions,
};

export default class SourcePane extends React.Component {
  render() {
    return (
      <Fragment>
        <p>
          <i>Where</i> your request comes from matters in some cases. Network Policies, Ingress, and
          service meshes can modulate requests based on their origin.
        </p>
        <div className={s.inputLine}>
          <p className={s.label}>Source Type</p>
          <select
            className={s.typeSelect}
            value={this.props.type}
            onChange={e => this.broadcastChange('type', e)}
          >
            {SourcePane.typeOptions()}
          </select>
        </div>

        {this.renderConditionalFields()}
      </Fragment>
    );
  }

  renderConditionalFields() {
    if (this.props.type === 'test-pod') {
      return (
        <Fragment>
          {this.renderNamespaceSelector()}
          {this.renderLabelsInput()}
        </Fragment>
      );
    }
    return <ComingSoonSection size="medium" />;
  }

  renderNamespaceSelector() {
    return (
      <div className={s.inputLine}>
        <p className={s.label}>Pod Namespace</p>
        <select
          className={s.typeSelect}
          value={this.props.namespace}
          onChange={e => this.broadcastChange('namespace', e)}
        >
          {Utils.arrayOptions(this.props.namespaces)}
        </select>
      </div>
    );
  }

  renderLabelsInput() {
    return (
      <div className={s.inputLine}>
        <p className={s.label}>Pod Labels</p>
        <ReactTags
          classNames={AUTO_COMPLETE_STYLES}
          suggestions={this.rinseTags(this.props.labelCombos)}
          handleAddition={() => console.log('lol')}
          handleDelete={() => console.log('ita')}
        />
      </div>
    );
  }

  rinseTags(tags) {
    return tags.map(t => ({ id: t, name: t }));
  }

  broadcastChange(field, event) {
    const assignment = { [field]: event.target.value };
    this.props.onFieldChanged(assignment);
  }

  static typeOptions() {
    return Utils.hashOptions({
      'test-pod': 'A one time pod we create inside your cluster',
      web: 'One of our servers on the web',
      'mimic-pod': 'A one time pod we create inside your cluster that mimics a deployment',
    });
  }

  static propTypes = {
    type: PropTypes.oneOf(['test-pod', 'web', 'mimic-pod']),
    namespaces: PropTypes.arrayOf(PropTypes.string),
    namespace: PropTypes.string,
    labelCombos: PropTypes.arrayOf(PropTypes.string),
    labels: PropTypes.arrayOf(PropTypes.string),
    onFieldChanged: PropTypes.func.isRequired,
  };
}
