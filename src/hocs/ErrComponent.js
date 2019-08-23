import React from "react";


export default class ErrComponent{

  static compose(WrappedComponent){

    return class extends React.Component {

      constructor(props){
        super(props);
        this.state = {
          isWorking: true,
          error: null
        };
        this.kubeErrorCallback = this.kubeErrorCallback.bind(this);
      }

      render(){
        if(this.state.isWorking)
          return this.renderNormalView();
         else
           return this.renderErrorView()
      }

      renderNormalView(){
        return(
          <WrappedComponent
            kubeErrorCallback={this.kubeErrorCallback}
            {...this.props}
          />
        )
      }

      kubeErrorCallback(error){
        console.log("GOT");
        console.log(error);
        this.setState((s) => ({...s, error, isWorking: false}))
      }

      renderErrorView(){
        return <p>Nah {this.state.error.kind}</p>
      }
    };
  }



}