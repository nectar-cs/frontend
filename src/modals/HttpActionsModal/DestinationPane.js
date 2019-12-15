//@flow
import React, {Fragment} from "react";
import PropTypes from 'prop-types'
import Utils from "../../utils/Utils";
import {Types} from "../../types/CommonTypes";
import FormComponent from "../../hocs/FormComponent";
import type {LightPod, Service} from "../../types/Types";

const HTTP_VERBS = ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'];

class DestinationPaneClass extends React.Component<Props> {

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
      DestinationPane.makeSvcHost(svc.name, svc.shortDns, svc.fromPort),
      DestinationPane.makeSvcHost(svc.name, svc.longDns, svc.fromPort),
      DestinationPane.makeSvcHost(svc.name, svc.internalIp, svc.fromPort),
      DestinationPane.makeSvcHost(svc.name, svc.externalIp, svc.fromPort),
    ]).flat();

    const podOptions = pods.map(pod =>
      DestinationPane.makePodHost(pod.name, pod.ip)
    );

    const combined = [...serviceOptions, ...podOptions];
    const cleaned = combined.filter(e => e);
    return Utils.arrayOfHashesOptions(cleaned);
  }

  static makeSvcHost(name, domain, port){
    if(!(domain && port)) return null;
    const key = `http://${domain}:${port}`;
    return { value: key,  show: `${key} (Service ${name})`}
  }

  static makePodHost(name, domain){
    if(!domain) return null;
    const key = `http://${domain}`;
    return { value: key, show: `${key} (Pod ${name})`}
  }

  static propTypes = {
    host: PropTypes.string,
    path: PropTypes.string,
    verb: PropTypes.oneOf(HTTP_VERBS),
    services: PropTypes.arrayOf(Types.Service),
    pods: PropTypes.arrayOf(Types.LightPod)
  }
}

type Props = {
  host: ?string,
  path: ?string,
  verb: ?string,
  services: Array<Service>,
  pods: Array<LightPod>
}

const DestinationPane = FormComponent.compose(
  DestinationPaneClass
);

export default DestinationPane;