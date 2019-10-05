import Text from "../../assets/text-combos";
import React, {Fragment} from "react";

const defaults = {
  header: {
    title: (name) => `${name} / source`,
    subtitle: "What's running on this deployment?"
  },
  howTo: {
    title: "Y u no Annotate?",
    title2: "Annotate from your CD",
    title3: "Try it from Here",
    lines: [
      "Annotations are a really powerful feature in Kubernetes!",
      "It's a way to attach metadata to Kubernetes resources.",
      "In this case, you'd want to tag a Deployment with the" +
      " its associated Git branch and commit."
    ],
    lines2: [
      "You need to tag your Deployment when you're updating/reloading its image.",
      "Add the following to your CD logic: "
    ],
    lines3: [
      "If you haven't noticed yet, Nectar can build and deploy for you.",
      "When it does, it annotates using the technique above.",
      "Click below to try, but remember to update your CD so it happens every time."
    ],
    commands: (name, ns) => [
      `kubectl config set-context --current --namespace=my-${ns}`,
      `kubectl annotate deployments ${name} branch=$BRANCH`,
      `kubectl annotate deployments ${name} commit-message=$MSG`,
      `kubectl annotate deployments ${name} commit=$COMMIT_SHA`
    ]
  },
};

export default defaults;