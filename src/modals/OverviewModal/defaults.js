const defaults = {
  header: {
    title: "Deployment Overview",
    subtitle: (name) => name ? `${name} and friends at a glance` : ''
  },

  tabsNames: [
    'Network',
    'Labels',
    'Cheat Sheet',
    'Docker',
    'Volumes',
    'Data'
  ],

  labelsSection: {
    labels: {
      title: ['metadata', 'labels'],
      hint: "how humans find me"
    },
    selectors: {
      title: ['spec', 'selector', 'matchLabels'],
      hint: "how i find my pods"
    },
    template: {
      title: ['spec', 'template', 'metadata', 'labels'],
      hint: "how my pods are born"
    }
  },

  labelChecks: {
    labelsUnique: {
      title: "No other deps in this namespace have the same labels?"
    },
    templateCovers: {
      title: "Selector labels subset of template labels?",
    },
    noSpill: {
      title: "Selector doesn't match other deps' pods?",
    },
    noEavesdrop: {
      title: "My pods selectable by no other deps?",
    },
    podsSameNs: {
      title: "Pod Template specifies same namespace?",
    }
  }

};

export default defaults;

