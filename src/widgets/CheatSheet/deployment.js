function _ns(ns, withNs) {
  if (withNs) return ` -n ${ns}`;
  else return '';
}

function out(cmd, f) {
  if (f === 'json_jq') return `${cmd} -o json | jq`;
  else if (f === 'json') return `${cmd} -o json`;
  else if (f === 'yaml') return `${cmd} -o yaml`;
}

const kubectlAssocs = [
  {
    desc: 'My pods (i.e where pod.labels >= me.matchLabels)',
    cmd: ({ k, ns, withNs, sel }) => {
      return `${k} get pods -l ${sel} ${_ns(ns, withNs)}`;
    },
  },
  {
    desc: 'Services talking to my pods',
    cmd: ({ k, ns, withNs }) => `I don't know a sane kubectl method :/ Use K8Kat :p`,
  },
];

const kubectlReading = [
  {
    desc: 'Full Resource',
    cmd: ({ k, f, d, ns, withNs }) => {
      if (f === 'plain') return `${k} describe deploy/${d}${_ns(ns, withNs)}`;
      else return out(`${k} get deploy/${d}${_ns(ns, withNs)}`, f);
    },
  },
  {
    desc: 'Metadata, Spec, Status',
    compat: ['json_jq'],
    cmd: ({ k, d, ns, withNs }) => [
      `${k} get deploy/${d}${_ns(ns, withNs)} -o json | jq .metadata`,
      `${k} get deploy/${d}${_ns(ns, withNs)} -o json | jq .spec`,
      `${k} get deploy/${d}${_ns(ns, withNs)} -o json | jq .status`,
    ],
  },
];

const kubectlContainerOps = [
  {
    desc: 'Change image to IMG',
    cmd: ({ k, d, cont, ns, withNs }) => `${k} set image deploy/${d}${_ns(ns, withNs)} ${cont}=IMG`,
  },
  {
    desc: 'Rollback Image Changes',
    cmd: ({ k, d, ns, withNs }) => [
      `${k} rollout undo deploy/${d}${_ns(ns, withNs)}`,
      `${k} rollout undo deploy/${d}${_ns(ns, withNs)} --to-revision=XYZ`,
    ],
  },
  {
    desc: 'Inspect Rollouts',
    cmd: ({ k, d, ns, withNs }) => [`${k} rollout history deploy/${d}${_ns(ns, withNs)}`],
  },
];

const kubectlPodOps = [
  {
    desc: 'Scale pods to X',
    cmd: ({ k, d, ns, withNs }) => `${k} scale --replicas=X deploy/${d}${_ns(ns, withNs)}`,
  },
  {
    desc: 'Scale pods to X *if* current count is sY',
    cmd: ({ k, d, ns, withNs }) =>
      `${k} scale --replicas=X --current-replicas=Y deployment/${d}${_ns(ns, withNs)}`,
  },
  {
    desc: 'Enable Autoscaling between X and Y',
    cmd: ({ k, d, ns, withNs }) => `${k} autoscale --min=X --max=Y deploy/${d}${_ns(ns, withNs)}`,
  },
];

const deploymentCopy = [
  {
    name: 'Inspection',
    apis: { kubectl: kubectlReading },
  },
  {
    name: 'Associations',
    apis: { kubectl: kubectlAssocs },
  },
  {
    name: 'Containers',
    apis: { kubectl: kubectlContainerOps },
  },
  {
    name: 'Pods',
    apis: { kubectl: kubectlPodOps },
  },
];

export default deploymentCopy;
