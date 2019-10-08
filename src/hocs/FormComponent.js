import React from "react";
import PropTypes from 'prop-types'
import {InputLine, LineInput, LineLabel} from "../assets/input-combos";

export default class FormComponent {
  static compose(InnerComponent)  {
    return class extends React.Component{
      constructor(props){
        super(props);
        this.makeSelect = this.makeSelect.bind(this);
        this.makeInput = this.makeInput.bind(this);
      }

      makeSelect(title, field, choices){
        const callback = (e) => { this.parentCallback(field, e.target.value); };
        return(
          <InputLine>
            <LineLabel size='large'>{title}</LineLabel>
            <LineInput
              as='select'
              value={this.props[field]}
              onChange={(e) => callback(e)}>
              { choices }
            </LineInput>
          </InputLine>
        )
      }

      makeInput(title, field){
        const callback = (e) => { this.parentCallback(field, e.target.value); };
        return(
          <InputLine>
            <LineLabel size='large'>{title}</LineLabel>
            <LineInput
              as='input'
              value={this.props[field]}
              onChange={(e) => callback(e)}
            />
          </InputLine>
        )
      }

      render(){
        return(
          <InnerComponent
            makeSelect={this.makeSelect}
            makeInput={this.makeInput}
            {...this.props}
          />
        )
      }

      static propTypes = {
        notifyFormValueChanged: PropTypes.func.isRequired
      };

      parentCallback(field, value) {
        this.props.notifyFormValueChanged(field, value);
      }
    }
  }
}