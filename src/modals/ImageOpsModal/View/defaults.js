import React, {Fragment} from "react";

export const defaults ={

  previewCommands: {
    reload: ({dep, ns, orig}) => [
      `kubectl scale deploy ${dep} --replicas=0 --namespace=${ns}`,
      `kubectl scale deploy ${dep} --replicas=${orig} --namespace=${ns}`
    ],
    change: ({dep, ns, cont, img}) => [
      `kubectl set image deploy/${dep} ${cont}=${img} --namespace=${ns}`,
    ],
    scale:  ({dep, ns, scaleTo}) => [
      `kubectl scale deploy ${dep} --replicas=${scaleTo} --namespace=${ns}`,
    ],
    docker: ({dep, ns, dImg, cont}) => [
      `kubectl set image deploy/${dep} ${cont}=${dImg} --namespace=${ns}`
    ],
    git: ({gRem, gRep, sha, dep, ns, dImg, dPath, cont}) => gRem && [
      `git clone git@github.com:${gRem}/${gRep}.git`,
      `git fetch origin ${sha}`,
      `docker build .${dPath} -t ${dImg}`,
      `docker push ${dImg}`,
      `kubectl set image deploy/${dep} ${cont}=${dImg} --namespace=${ns}`
    ],
  },

  errors: {
    imagePullPolicyWrong: ({dep, actual}) => (
      `${dep}'s imagePullPolicy is '${actual}' when it should be 'Always'.
      Apply the command above to update it. 
      `
    )
  },

  header: {
    title: (name, mode) => {
      if(mode === 'modal') return `${name} / image ops`;
      else return "Image Operations"
    },
    subtitle: "Manipulate this deployment's images and pods"
  },
  copy: {
    intro: {
      preSubmit: "You can set a new image or force " +
        " apply one with the same name.",
      postSubmit: "All pods are being restarted. The operation " +
        "will be done once the following are true: "
    }
    ,
    warningOne: (
      <Fragment>
        <b>Important.</b> If anything goes wrong, or if your image fails,
        your app may go offline.
      </Fragment>
    ),
    risks: (
      <ul>
        <li><p>asdsa</p></li>
      </ul>
    ),
    dockerNotSet: "Deployment not bound to Docker."
  },

  els: {
    blockedConn: (action, thing) => (
      <Fragment>
        Make sure you <a onClick={action}>connect</a> to {thing}.
      </Fragment>
    ),
    blockedBind: (path, thing) => (
      <Fragment>
        And that you <a href={path}>bind</a> this deployment to a {thing}.
      </Fragment>
    ),
    blockedIcon: "sentiment_very_dissatisfied"
  }
};