const defaults = {
  header: {
    title: (name, mode) => {
      if (mode === 'modal') return `${name} / logs`;
      return 'Deployment Logs';
    },
    subtitle: 'Who needs UIs when we have logs ;)',
  },
};

export default defaults;
