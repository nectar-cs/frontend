import React from 'react'
import s from './WorkspaceForm.sass'
import ReactTags from 'react-tag-autocomplete';
import ss from './../../../assets/react-tags.sass'


export default class WorkspaceForm extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={s.form}>
        <div className={s.inputLine}>
          <p className={s.label}>Workspace Name</p>
          <input className={s.textInput} placeholder='e.g Data science apps'/>
        </div>

        <div className={s.inputLine}>
          <p className={s.label}>Namespace Filter</p>
          { this.renderNamespaceSelector() }
        </div>

        <div className={s.inputLine}>
          <p className={s.label}>Filter Method</p>
          { this.renderFilterTypeSelect() }
        </div>

        <div className={s.inputLine}>
          <p className={s.label}>Label Filter</p>
          { this.renderNamespaceSelector() }
        </div>

        <div className={s.inputLine}>
          <p className={s.label}>Filter Method</p>
          { this.renderFilterTypeSelect() }
        </div>
      </div>
    )
  }

  async handleDelete(i) {
    // const updatedNamespaces = selectedNamespaces.slice(0);
    // const updatedSuggestions = suggestions.slice(0);
    // updatedSuggestions.push(selectedNamespaces[i]);
    // updatedNamespaces.splice(i, 1);
    // setSuggestions(updatedSuggestions);
    // setSelectedNamespaces(updatedNamespaces);
    // await updateWorkspace(workspaceId);
  }

  async handleAddition(namespace) {
    // const updatedSuggestions = suggestions.slice(0);
    // const updatedNamespaces = [...selectedNamespaces, namespace];
    // setSuggestions(updatedSuggestions.filter(s => s.id !== namespace.id));
    // setSelectedNamespaces(updatedNamespaces);
    // await updateWorkspace(workspaceId);
  }

  renderNamespaceSelector() {
    return (
      <ReactTags
        minQueryLength={0}
        placeholder="Filter by namespace..."
        tags={[{id: 1, name: "hello"}]}
        suggestions={[{id: 2, name: "goodbye"}]}
        handleDelete={this.handleDelete}
        handleAddition={this.handleAddition}
        autofocus={false}
        classNames={{
          root: s.autoComplete,
          selected: ss.reactTagsSelected,
          selectedTag: ss.reactTagsSelectedTag,
          search: ss.reactTagsSearch,
          suggestions: ss.reactTagsSuggestions
        }}
      />
    );
  }

  renderFilterTypeSelect(){
    return(
      <select className={s.selectInput}>
        <option>Whitelist</option>
        <option>Blacklist</option>
      </select>
    )
  }
}