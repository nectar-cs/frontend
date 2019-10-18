const defaults = {
  debuggers: {
    network: {
      header: {
        title: (name) => `${name} / network debug`,
        subtitle: "Root cause analysis for connection WTFs"
      }
    }
  },
  decisionTree: {
    title: "Diagnosis Tree"
  },

  step: {
    title: (i, name) => `Step ${i}: ${name}`,
    subtitle: "An attempt to determine if this is the problem..."
  }
};

export default defaults;