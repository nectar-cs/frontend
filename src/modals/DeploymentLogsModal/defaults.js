const defaults = {
  header: {
    title: (name, mode) => {
      if (mode === 'modal') return `${name} / logs`;
      else return "Deployment Logs"
    },
    subtitle: "The best part of an app amirght?"
  }
};

export default defaults;