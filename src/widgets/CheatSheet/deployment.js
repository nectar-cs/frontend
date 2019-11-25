function _ns(ns, withNs){
  if(withNs) return ` -n ${ns}`;
}

function out(cmd, f){
  if(f === 'json_jq')
    return `${cmd} -o json | jq`;
  else if(f === 'json')
    return `${cmd} -o json`;
  else if(f === 'yaml')
    return `${cmd} -o yaml`;
}

const kubectlAssocs = [
  {
    desc: "My pods",
    cmd: ({k, ns, withNs, sel}) => {
      return `${k} get pods -l ${sel} ${_ns(ns, withNs)}`
    }
  },
  {
    desc: "Services talking to my pods",
    cmd: ({k, ns, withNs}) => {
    }
  }
];

const kubectlReading = [
  {
    desc: "Full Resource",
    cmd: ({k, f, d, ns, withNs}) => {
      if(f === 'plain')
        return `${k} describe deploy/${d}${_ns(ns, withNs)}`;
      else return out(`${k} get deploy/${d}${_ns(ns, withNs)}`);
    },
  },
  {
    desc: "Metadata, Spec, Status",
    compat: ['json_jq'],
    cmd: ({k, d, ns, withNs}) => [
      `${k} get deploy/${d}${_ns(ns, withNs)} -o json | jq .metadata`,
      `${k} get deploy/${d}${_ns(ns, withNs)} -o json | jq .spec`,
      `${k} get deploy/${d}${_ns(ns, withNs)} -o json | jq .status`
    ]
  }
];

const kubectlUpdating = {
  desc: "Rollout",
  cmd: ({k, d, cont, ns, withNs}) =>{
    return `${k} set image deploy/${d} ${cont}=IMG ${ns(ns, withNs)} `
  }
};

const deploymentCopy = [
  // {
  //   name: "Associations",
  //   apis: { kubectl: kubectlAssocs }
  // },
  {
    name: "Inspection",
    apis: { kubectl: kubectlReading }
  }
];

export default deploymentCopy;