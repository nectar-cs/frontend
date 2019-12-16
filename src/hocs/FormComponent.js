import React from "react";
import PropTypes from 'prop-types'
import {In} from 'ui-common';
import TagPool from "../widgets/TagPool/TagPool";

export default class FormComponent {
  static compose(InnerComponent)  {
    return class extends React.Component{
      constructor(props){
        super(props);
        this.makeSelect = this.makeSelect.bind(this);
        this.makeInput = this.makeInput.bind(this);
        this.makeSelectItem = this.makeSelectItem.bind(this);
        this.makeInputItem = this.makeInputItem.bind(this);
        this.makeLine = this.makeLine.bind(this);
        this.makeTagPool = this.makeTagPool.bind(this);
      }

      makeLine(title, builders){
        return(
          <In.InputLine>
            <In.LineLabel size='large'>{title}</In.LineLabel>
            { builders.map(b => b()) }
          </In.InputLine>
        )
      }

      makeSelectItem(field, choices){
        const callback = (e) => { this.parentCallback(field, e.target.value); };
        return(
          <In.LineInput
            as='select'
            value={this.getValue(field)}
            onChange={(e) => callback(e)}>
            { choices }
          </In.LineInput>
        )
      }

      makeInputItem(field, placeholder){
        const callback = (e) => { this.parentCallback(field, e.target.value); };
        return(
          <In.LineInput
            as='input'
            value={this.getValue(field)}
            onChange={(e) => callback(e)}
            placeholder={placeholder}
          />
        )
      }

      makeSelect(title, field, choices){
        return(
          <In.InputLine>
            <In.LineLabel size='large'>{title}</In.LineLabel>
            { this.makeSelectItem(field, choices) }
          </In.InputLine>
        )
      }

      makeTagPoolItem(field, choices){
        return(
          <TagPool/>
        )
      }

      makeTagPool(title, field, choices){
        return(
          <In.InputLine>
            <In.LineLabel size='large'>{title}</In.LineLabel>
            { this.makeTagPoolItem(field, choices) }
          </In.InputLine>
        )
      }

      makeInput(title, field, placeholder){
        return(
          <In.InputLine>
            <In.LineLabel size='large'>{title}</In.LineLabel>
            { this.makeInputItem(field, placeholder) }
          </In.InputLine>
        )
      }

      render(){
        return(
          <InnerComponent
            makeSelect={this.makeSelect}
            makeInput={this.makeInput}
            makeSelectItem={this.makeSelectItem}
            makeInputItem={this.makeInputItem}
            makeTagPool={this.makeTagPool}
            makeLine={this.makeLine}
            {...this.props}
          />
        )
      }

      getValue(field){
        if(this.props.retriever){
          return this.props.retriever(this.props, field);
        } else return this.props[field];
      }

      static propTypes = {
        notifyFormValueChanged: PropTypes.func.isRequired,
        retriever: PropTypes.func
      };

      parentCallback(field, value) {
        this.props.notifyFormValueChanged(field, value);
      }
    }
  }
}