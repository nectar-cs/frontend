import React, {Fragment} from "react";

const defaults = {
  header: {
    title: (name, mode) => {
      if(mode === 'modal') return `${name} / port forward`;
      else return "Port Forward";
    },
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
    command: (type, res, from, to, ns) =>
      `kubectl port-forward ${type}/${res} ${from}:${to} --namespace=${ns}`,
    instr: "Paste the following command into your terminal: ",
    lines: (fromPort, toPort, link) => [
      `Your computer's port ${fromPort} will forward to your cluster's port ${toPort}`,
      <Fragment>Get <a href={link} target='_blank'>Mosaic Desktop</a> to do this in one shot.</Fragment>
    ],
    desktop: "https://github.com/robonectar/news_crawler"
  },
  sectionThree: {
    title: "Luxury Port Forward",
  }
};

export default defaults;