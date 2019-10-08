const defaults = {
  header: {
    title: (name) => `${name} / proxy`,
    subtitle: "Port Forwarding Wizard"
  },
  sectionOne: {
    title: "Config",
    lines: [
      "The browser version of Mosaic can only tell you what command to paste.",
    ],
    intro: "You have a couple of options, but it usually doesn't matter.",
    resTypes: ["Deployment", "Service", "Pod"]
  },
  sectionTwo: {
    title: "Copy Pasta",
    command: (type, res, from, to) =>
      `kubectl port-forward ${type}/${res} ${from}:${to}`,
    instr: "Paste the following command into your terminal: ",
    lines: (fromPort, toPort, link) => [
      `Your computer's port ${fromPort} will forward to your cluster's port ${toPort}`,
      `Get the ${link} to do this in one shot.`
    ],
    desktop: "https://github.com/robonectar/news_crawler"
  },
  sectionThree: {
    title: "Luxury Port Forward",
  }
};

export default defaults;