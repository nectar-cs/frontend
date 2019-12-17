//@flow
import React, {Fragment} from "react";
import Utils from "../../utils/Utils";
import FormComponent from "../../hocs/FormComponent";
import type {LightPod, Service} from "../../types/Types";
import Helper from './Helper'

const HTTP_VERBS = ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'];

class DestinationFormClass extends React.Component<Props> {

  constructor(props) {
    super(props);
    this.renderPathInput = this.renderPathInput.bind(this);
    this.renderVerbInput = this.renderVerbInput.bind(this);
  }

  render(){
    return(
      <Fragment>
        { this.renderHostSelect() }
        { this.renderPathAndVerb() }
      </Fragment>
    )
  }

  renderHostSelect(){
    return this.props.makeSelect(
      "Target host",
      "host",
      this.hostOptions()
    );
  }

  renderPathAndVerb(){
    return this.props.makeLine("Path and Verb", [
        this.renderPathInput,
        this.renderVerbInput
      ]
    )
  }

  renderPathInput(){
    return this.props.makeInputItem("path");
  }

  renderVerbInput() {
    return this.props.makeSelectItem(
      "verb",
      Utils.arrayOptions(HTTP_VERBS)
    );
  }

  hostOptions(){
    const { services, pods } = this.props;

    const serviceOptions = services.map(svc => [
      Helper.makeSvcHost(svc.name, svc.shortDns, svc.fromPort),
      Helper.makeSvcHost(svc.name, svc.longDns, svc.fromPort),
      Helper.makeSvcHost(svc.name, svc.internalIp, svc.fromPort),
      Helper.makeSvcHost(svc.name, svc.externalIp, svc.fromPort),
    ]).flat();

    const podOptions = pods.map(pod =>
      Helper.makePodHost(pod.name, pod.ip)
    );

    const combined = [...serviceOptions, ...podOptions];
    const cleaned = combined.filter(e => e);
    return Utils.arrayOfHashesOptions(cleaned);
  }
}

type Props = {
  host: ?string,
  path: ?string,
  verb: ?string,
  services: Array<Service>,
  pods: Array<LightPod>
}

const DestinationForm = FormComponent.compose(DestinationFormClass);
export default DestinationForm;