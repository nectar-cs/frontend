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
    runCheck: "Start this Step"
  },

  form: {
    origins: {
      inNamespace: "Inside the cluster, same namespace",
      outNamespace: "Inside the cluster, different namespace",
      outCluster: "Outside the cluster"
    }
  },

  steps: {
    staticChecksStep: {
      title: "Check 1: Static Analysis",
      explanation: [
        "Check that the service is the right type",
        "Check that service.port == dep.port"
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
      title: "Check 5: NetPol/Ingress Interference",
      explanation: [
        "Determine ports expected to be reachable on image",
        "Run image locally, cURL determined ports"
      ],
    }
  }
};

export default defaults;