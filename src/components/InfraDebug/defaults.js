const defaults = {
  debuggers: {
    network: {
      header: {
        title: (name) => `${name} / network debug`,
        subtitle: "Root cause analysis for connection WTFs"
      }
    }
  },

  treeData: [
    {
      name: 'Top Level',
      children: [
        {
          name: 'Level 2: A',
          children: [
            {
              name: 'Level 2: A',
            },
            {
              name: 'Level 2: B',
            },
          ],
        },
        {
          name: 'Level 2: B',
        },
      ],
    },
  ]
};

export default defaults;