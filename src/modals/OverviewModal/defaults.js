const defaults = {
  header: {
    title: "Deployment Overview",
    subtitle: (name) => name ? `${name} and friends at a glance` : ''
  },

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
  }

};

export default defaults;

