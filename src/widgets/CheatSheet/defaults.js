const defaults = {
  apiChoices: [
    { show: 'kubectl and friends', value: 'kubectl' },
    { show: 'K8Kat', value: 'k8kat' },
    { show: 'Python official client', value: 'python' },
  ],
  kubectlFlavors: [
    { show: 'Plain', value: 'plain' },
    { show: 'JSON', value: 'json' },
    { show: 'YAML', value: 'yaml' },
    { show: 'JSON + jq', value: 'json_jq' },
  ],
};

export default defaults;
