import React, {useEffect} from 'react'
import RevisionChecker from "../utils/RevisionChecker";

export default class UpdateCheckComposer {
  static compose(Component){
    return function(props){
      const checker = new RevisionChecker();
      const runCheck = () => {
        checker.perform().then(verdict => {
          if(verdict){
            if(!props.openModal){
              console.log("THIS COMP SHOULD HAVE MODAL OPEN");
              return;
            }

            console.log("OH SHIT GOTTA UPDATE");
          }
        })
      };

      useEffect(runCheck);
      return <Component {...props} />
    }
  }
}