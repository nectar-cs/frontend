const defaults = {
  debuggers: {
    network: {
      header: {
        title: (name) => `${name} / network debug`,
        subtitle: "Root cause analysis for connection WTFs"
      }
    }
  }
};

export default defaults;