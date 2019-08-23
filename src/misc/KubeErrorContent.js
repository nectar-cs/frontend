import React, {Fragment} from "react";
import s from './KubeErrorContent.sass'

export function kapiErrorTitle(props){

  console.log("PROPS1");
  console.log(props);

  if(props.kind === 'hard')
    return "K8s companion unreachable";
  else if(props.kind === 'soft'){
    return 'K8s API unreachable'
  }
  else return "Unknown Error"
}

export function KapiErrorContent(props){
  let content = null;
  if(props.kind === 'hard') {
    content = KAPIUnreachable(props.error);
  }
  else if(props.kind === 'soft'){
    content = KAPINotConnecting(props.error);
  }
  else content = KapiDefaultError(props.error);

  return(
    <Fragment>
      { content }
      <p className={s.closing}>For more, read our <a href={'asdasd'}>complete article.</a></p>
    </Fragment>
  )
}

function KAPIUnreachable(){
  return(
    <Fragment>
      <div className={s.section}>
        <p>
          <span className={s.keyword}>Synopsis</span>.
          The web app could not talk to its companion backend in your cluster.
        </p>
      </div>

      <div className={s.section}>
        <p>
          <span className={s.keyword}>Possible causes</span>.
          There are three likely explanations:
        </p>
        <ul>
          <li><p>The companion not running</p></li>
          <li><p>Network Policies are blocking HTTP</p></li>
          <li><p>RBAC Permissions are wrong</p></li>
        </ul>
      </div>

      <div className={s.section}>
        <p>
          <span className={s.keyword}>Remediation</span>.
          For each possibility, try the following:
        </p>
        <ul>
          <li><p>
            Run <code>kubectl get pods --namespace=mosaic</code>.
            If <code>kapi</code> has 0, find out why.
          </p></li>

          <li><p>
            Run <code>kubectl get svc --namespace=mosaic</code>.
            Inspect your network policies for interference.
          </p></li>

            <li><p>Compare your permissions for nectar with the default.</p></li>
        </ul>

      </div>
    </Fragment>
  )
}

function KAPINotConnecting(props){

  console.log("PROPS");
  console.log(props);

  return(
    <Fragment>
      <div className={s.section}>
        <p>
          <span className={s.keyword}>Synopsis</span>.
          The companion web app cannot talk to the Kubernetes API in your cluster.
        </p>
      </div>

      <div className={s.section}>
        <p>
          <span className={s.keyword}>Error Message</span>.
          Kubernetes threw the following error when Mosaic tried connecting to it:
        </p>
        <br/>
        <p><code>{props.reason}</code></p>
      </div>

      <div className={s.section}>
        <p>
          <span className={s.keyword}>Remediation</span>.
          For each possibility, try the following:
        </p>
        <ul>
          <li><p>
            Run <code>kubectl get pods --namespace=mosaic</code>.
            If <code>kapi</code> has 0, find out why.
          </p></li>

          <li><p>
            Run <code>kubectl get svc --namespace=mosaic</code>.
            Inspect your network policies for interference.
          </p></li>

          <li><p>Compare your permissions for nectar with the default.</p></li>
        </ul>

      </div>
    </Fragment>
  )
}

function KapiDefaultError(props){
  return <p>Write me!</p>;
}