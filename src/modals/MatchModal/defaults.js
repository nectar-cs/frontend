const defaults = {

  header: {
    title: (mode, dep) => (
      mode === 'detail' ? "Git and Docker Matching" : dep.name
    ),
    subtitle: 'Bind this deployment to git and image repos'
  }

};

export default defaults;