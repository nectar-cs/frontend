const defaults = {
  header: {
    title: (mode, ns, name) => {
      if(mode === 'fragment') return `pods / ${name}`;
      else return `${ns}/${name}`;
    }
  }
};

export default defaults;