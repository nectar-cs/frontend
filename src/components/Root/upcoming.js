const upcoming = {
  playground: {
    featureName: 'Playground - Fastest Cloud Native Experimentation on Earth',
    info: [
      'Choose from list of Dockerfile x YAML x App Source combos, ' +
        'edit them, run them in the cluster, and click to cleanup.',

      'Why is it that with Python/Ruby/etc you can fire up an interpreter, ' +
        'try things, learn, and exit, but in Kubernetes you have to think of ' +
        '20 things?',

      "The goal with Playground is to eliminate the 'quicksand' effect K8s " +
        'has on devs and let us try things out at blitz speed.',
    ],
  },

  observatory: {
    featureName: 'Observatory - Ultraclean 2D view of a cluster',
    info: ["Useful representations of a cluster's contents."],
  },

  experiments: {
    featureName: 'Laboratory - Repeatable Infra Tests',
    info: [
      "With the growing complexity of clusters, it's kind of shocking we don't " +
        'have repeatable ways to make sure the cluster behaves the way we ' +
        'expect it to.',

      'Laboratory is for encoding such behavior tests.',
    ],
  },

  regressionTesting: {
    featureName: 'Reg Tests - Infra CI',
    info: ['Putting pass/fail conditions around our Laboratory experiments.'],
  },

  compliance: {
    featureName: 'Compliance',
    info: [
      'For proving to ourselves and others that our Reg Tests ' + ' actually get run and pass.',
    ],
  },

  costPolicies: {
    featureName: 'Cost Optimization for Dev Clusters',
    info: [
      "Spinning things down to save money isn't too hard, if you're talking " +
        'about dev envs. But doing it consistently and without tripping up, is PITA.',

      'CANTEEN (codename for this project) is a cost auto-tuner for dev clusters. ',

      'Tell CANTEEN how the dev team works, and it will turn the lights off ' +
        ' when and where appropriate - constantly. ',

      'E.g, tell it which microservices depend on each other, and it will spin down ' +
        ' anything not necessary right now. Or, tell it that no one works after 6 ' +
        ' and it will make sure everything is off by then.',
    ],
  },

  costPolicyAnalysis: {
    featureName: 'Policy Efficacy Analysis',
    info: ['See which remote-cluster-based development day are costing the most.'],
  },
};

export default upcoming;
