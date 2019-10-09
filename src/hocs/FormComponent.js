import React from "react";
import PropTypes from 'prop-types'
import In from "../assets/input-combos";

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
          <In.InputLine>
            <In.LineLabel size='large'>{title}</In.LineLabel>
            <In.LineInput
              as='select'
              value={this.props[field]}
              onChange={(e) => callback(e)}>
              { choices }
            </In.LineInput>
          </In.InputLine>
        )
      }

      makeInput(title, field, placeholder){
        const callback = (e) => { this.parentCallback(field, e.target.value); };
        return(
          <In.InputLine>
            <In.LineLabel size='large'>{title}</In.LineLabel>
            <In.LineInput
              as='input'
              value={this.props[field]}
              onChange={(e) => callback(e)}
              placeholder={placeholder}
            />
          </In.InputLine>
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