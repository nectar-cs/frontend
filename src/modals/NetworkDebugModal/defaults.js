
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
  dockerPortStep: {
    title: "Check 1: Image Accepts Traffic?",
    explanation: [
      "Read the Dockerfile, determine expected open ports",
      "Run image locally, cURL determined ports"
    ],
  }
};

export default defaults;