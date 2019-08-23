import React, {Fragment} from "react";
import s from './KubeErrorContent.sass'

export function kapiErrorTitle(props){
  if(props.kind === 'hard')
    return "K8s companion unreachable";
  else
    return <p>Unknown</p>
}

export function KapiErrorContent(props){
  if(props.kind === 'hard')
    return KAPIUnreachable(props.error);
  else
    return <p>Unknown</p>
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

}

function KapiDefaultError(props){

}