const defaults = {
  header: {
    title: (mode, ns, name) => {
      if(mode === 'fragment') return `pods / ${name}`;
      else return `${ns}/${name}`;
    },
    subtitle: (depName) => `One of ${depName}'s little ducklings.`
  },
  tabs: [
    "Overview",
    "Problems",
    "CPU, RAM, Disk",
    "Logs"
  ]
};

export default defaults;