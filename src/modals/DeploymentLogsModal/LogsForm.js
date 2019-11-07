import React, {Fragment} from 'react'
import FormComponent from "../../hocs/FormComponent";
import MiscUtils from "../../utils/MiscUtils";

class LogsFormClass extends React.Component<Props> {
  render(){
    return(
      <Fragment>
        { this.renderPodSelector() }
      </Fragment>
    )
  }

  renderPodSelector(){
    const { podNameChoices } = this.props;
    return this.props.makeSelect(
      "Pod",
      "selectedPodName",
      MiscUtils.arrayOptions(podNameChoices)
    )
  }
}

type Props =  {
  selectedPodName: ?string,
  podNameChoices: string[]
}

const LogsForm = FormComponent.compose(
  LogsFormClass
);

export default LogsForm;