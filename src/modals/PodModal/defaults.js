const defaults = {
  header: {
    title: (mode, ns, name) => {
      if (mode === 'fragment') return `pods / ${name}`;
      else return `${ns}/${name}`;
    },
    subtitle: depName => `One of ${depName}'s little ducklings.`,
  },
  tabs: ['State', 'Resource', 'Cheat Sheet', 'Volumes', 'Logs'],
  events: {
    gamePlan: ({ ns, name }) => [
      `kuebctl describe pod/${name} -n ${ns}`,
      `kubectl get events --field-selector involvedObject.name=${name} -n ${ns}`,
      `---- Or with K8Kat`,
      `K8Kat.pods().find_like(<dep name>).events()\``,
    ],
  },
};

export default defaults;
