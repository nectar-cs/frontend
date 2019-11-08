const defaults = {
  header: {
    title: (name, mode) => {
      if (mode === 'modal') return `${name} / logs`;
      else return "Deployment Logs"
    },
    subtitle: "Who needs UIs when we have logs ;)"
  }
};

export default defaults;