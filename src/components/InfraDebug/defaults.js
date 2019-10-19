const defaults = {
  debuggers: {

    notReady: "Finish the setting up on the left panel.",

    network: {
      header: {
        title: (name) => `${name} / network debug`,
        subtitle: "Root cause analysis for connection WTFs"
      },
    }
  },

  decisionTree: {
    title: "Diagnosis Tree"
  },

  step: {
    title: (i, name) => `Step ${i}: ${name}`,
    subtitle: "An attempt to determine if this is the problem..."
  },

  options: {
    title: "Options",
    submit: "Debug with these options",
    strategies: {
      network: {
        optimistic: "Head First - Start at Service Level",
        pessimistic: "Tail First - Start at Container Level"
      }
    }

  }
};

export default defaults;