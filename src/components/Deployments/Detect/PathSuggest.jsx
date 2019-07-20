//@flow
import React from 'react'
import Autocomplete from 'react-autocomplete';
import s from './PathSuggest.sass'
import DataUtils from '../../../utils/DataUtils';

type Props = {
  pathTree: Array<string>
};

type State = {

}

export default class PathSuggest extends React.Component<Props, State> {

  constructor (props) {
    super(props);
    this.state = {
      value: '',
      forceOpen: true,
      committed: []
    };
    this.onTextEdited = this.onTextEdited.bind(this);
  }

  getCrtLevelKeys(){
    if(this.getTree()) {
      const hash = DataUtils.getNestedObject(this.getTree(), this.state.committed);
      return Object.keys(hash);
    } else return [];
  }

  getSuggestions(){
    if(this.getTree()){
      const x = this.getCrtLevelKeys();
      // console.log("SEARCHING WITH ");
      // console.log(this.state.committed);
      // console.log("YIELDS");
      // console.log(x);
      return this.getCrtLevelKeys().map((dir) => {
        const fullPathParts = [...this.state.committed, dir];
        return { id: dir, label: fullPathParts.join(' / ') }
      });
    } else return [];
  }

  getTree(){
    return this.props.pathTree;
  }

  backSearch(parts){
    for(let i=0; i < parts.length; i++){
      const subset = parts.slice(i, parts.length);
      if(DataUtils.getNestedObject(this.getTree(), subset)){
        return subset;
      }
    }
    return [];
  }

  onTextEdited(inputValue){
    if(inputValue){
      const inputParts = inputValue.split(" / ");
      const base = this.backSearch(inputParts);
      if(!DataUtils.arrayEquals(base, this.state.committed)){
        console.log("COMMITTING from \"" + inputValue + "\"");
        console.log(base);
        const str = base.join(" / ") + " / ";
        this.setState((s) => ({...s, committed: base, value: str}));
        return;
      }
    }
    this.setState((s) => ({...s, value: inputValue}));
  }

  render() {
    return (
      <Autocomplete
        items={this.getSuggestions()}
        shouldItemRender={(item, value) => item.label.toLowerCase().indexOf(value.toLowerCase()) > -1}
        getItemValue={item => item.label}
        renderItem={(item, highlighted) =>
          <div className={highlighted ? s.highlightedRow : s.row} key={item.id}>
            <p className={s.rowItem}>{item.label}</p>
          </div>
        }
        inputProps={{className: s.pathInput}}
        value={this.state.value}
        onSelect={(value) => this.onTextEdited(value)}
        onChange={e => this.onTextEdited(e.target.value)}
        selectOnBlur={true}
      />
    )
  }
}