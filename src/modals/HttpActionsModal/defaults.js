export const defaultHeaders = ['Content-Type: application/json'].join('\n');

export const defaultBody = JSON.stringify(
  {
    data: {
      type: 'test payload',
    },
  },
  null,
  2,
);

const defaults = {
  previewCommands: ({ ns, curl }) => [
    `kubectl run curler --image=nectar/curler --namespace=${ns}`,
    `cmd="${curl}"`,
    `kubectl exec $cmd curler --namespace=${ns}`,
  ],
};

export default defaults;
