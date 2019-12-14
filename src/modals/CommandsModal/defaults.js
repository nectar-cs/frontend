const defaults = {
  header: {
    title: (name, mode) => {
      if (mode === 'modal') return `${name} / command`;
      return 'Command Execution';
    },
    subtitle: "Send commands to the deployment's pods",
  },
  sectionOne: {
    title: 'Config',
  },
  sectionTwo: {
    title: 'Preview',
  },
  sectionThree: {
    title: 'History',
    confirmDelete: 'Are you sure?',
  },
};

export default defaults;
