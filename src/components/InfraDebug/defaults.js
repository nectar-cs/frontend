const defaults = {
  debuggers: {

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
    subtitle: "An attempt to determine if this is the problem...",
    notReady: "Finish the setting up on the left panel.",
    consolePrompt: "Click below to start",
    runCheck: "Run",
    nextCheck: "Next Step",
    explanation: {
      title: "Game Plan",
      subtitle: "Work to be carried out:"
    },
    progress: {
      title: `Kubectl`
    },
    verdict: {
      title: "Conclusion"
    }
  },

  options: {
    title: "Options",
    submit: "Debug with these options",
    strategies: {
      network: {
        optimistic: "Optimistic - Assume the best",
        pessimistic: "Pessimistic - Assume the worst"
      }
    }

  }
};

export default defaults;