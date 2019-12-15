//@flow
import React, {Fragment} from 'react'
import Utils from "../../utils/Utils";
import ComingSoonSection from "../../widgets/ComingSoonSection/ComingSoonSection";
import FormComponent from "../../hocs/FormComponent";

class SourcePaneClass extends React.Component<Props> {

  render(){
    return(
      <Fragment>
        { this.renderIntro() }
        { this.renderTypeSelect() }
        { this.renderNamespaceSelector() }
        { this.renderComingSoon() }
      </Fragment>
    )
  }

  renderIntro(){
    return(
      <p><i>Where</i> your request comes from matters in some cases.
        Network Policies, Ingress, and service meshes
        can modulate requests based on their origin.</p>
    )
  }

  renderTypeSelect(){
    return this.props.makeSelect(
      "Source Type",
      "type",
      SourcePaneClass.typeOptions()
    )
  }

  renderComingSoon(){
    if(this.props.type === 'test-pod') return null;
    return <ComingSoonSection size='medium'/>;
  }

  renderNamespaceSelector(){
    if(this.props.type !== 'test-pod') return null;
    return this.props.makeSelect(
      "Pod Namespace",
      "namespace",
      Utils.arrayOptions(this.props.namespaces)
    );
  }

  static typeOptions(){
    return Utils.hashOptions({
      'test-pod': "A one time pod we create inside your cluster",
      'web': "One of our servers on the web",
      'mimic-pod': "A one time pod we create inside your cluster that mimics a deployment"
    })
  }
}

type Props = {
  type: 'test-pod' | 'web' | 'mimic-pod',
  namespaces: Array<string>,
  namespace: ?string,
  labelCombos: Array<string>,
  labels: Array<string>,
  onFieldChanged: any => any
}

const SourcePane = FormComponent.compose(
  SourcePaneClass
);

export default SourcePane;