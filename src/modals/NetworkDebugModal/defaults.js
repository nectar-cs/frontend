
const defaults = {
  header: {
    title: (mode, name) => {
      if(mode === 'fragment') return "Debug Networking";
      else return `${name} / debug networking`
    },
    icon: "bug_report",
    subtitle: "Root cause for networking WTFs"
  }
};

export default defaults;