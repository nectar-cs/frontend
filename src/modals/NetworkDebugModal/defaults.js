
const defaults = {
  header: {
    title: (mode, name) => {
      if(mode === 'fragment') return "Debug Networking";
      else return `${name} / debug networking`
    },
    icon: "bug_report",
    subtitle: "Root cause analysis for networking WTFs"
  },
  general: {
    consolePrompt: "Click below to start",
    runCheck: "Run the Check"
  },
  steps: {
    staticChecksStep: {
      title: "Check 1: Static Analysis",
      explanation: [
        "Check that ",
        "Check that service.port == dep.port",
        "Run image locally, cURL determined ports"
      ],
    },
    dockerPortStep: {
      title: "Check 2: Image Accepts Traffic?",
      explanation: [
        "Determine ports expected to be reachable on image",
        "Run image locally, cURL determined ports"
      ],
    },
    podsStep: {
      title: "Check 3: Pods Accept Traffic?",
      explanation: [
        "Determine ports expected to be reachable on image",
        "Run image locally, cURL determined ports"
      ],
    },
    serviceStep: {
      title: "Check 4: Service Check",
      explanation: [
        "Determine ports expected to be reachable on image",
        "Run image locally, cURL determined ports"
      ],
    },
    interferenceStep: {
      title: "Check 5: Network Policy Interference",
      explanation: [
        "Determine ports expected to be reachable on image",
        "Run image locally, cURL determined ports"
      ],
    }
  }
};

export default defaults;