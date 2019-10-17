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

export const nodeShape = {
  shape: 'rect',
  shapeProps: {
    width: 30,
    height: 30,
    transform: "rotate(-45 0 0)",
    x: -15,
    y: -15,
  }
};

export default defaults;