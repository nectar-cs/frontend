import React from "react";

const defaults = {
  header: {
    title: (name) => `${name} / active commit`,
    subtitle: "What's running on this deployment?"
  },

  notMatched: {
    line: "Bind to a repo so Mosaic can read the commit. Click me start."
  },

  noFetch: {
    message: (addr, sha) => `Fetch failed - ${addr} isn't returning data for sha ${sha}.`
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
      "That way, Nectar can pick it up and show you what branch/commit you're on.",
      "Add the following to your CD logic: "
    ],
    lines3: [
      "If you haven't noticed yet, Nectar can build and deploy for you.",
      "When it does, it annotates using the technique above.",
      "Click below to try, but remember to update your CD so it happens every time."
    ],
    commands: (name, ns) => [
      `kubectl config set-context --current --namespace=${ns}`,
      `kubectl annotate deployment ${name} commit-branch=$COMMIT_BRANCH`,
      `kubectl annotate deployment ${name} commit-message=$COMMIT_MSG`,
      `kubectl annotate deployment ${name} commit-sha=$COMMIT_SHA`
    ]
  },
  defaultGitAvatar: "https://camo.githubusercontent.com/5b04e1aebf71604ea41205f32c01f3637651b3e4/68747470733a2f2f322e67726176617461722e636f6d2f6176617461722f61313533366364323462646237336531303532653331626362313631343132343f643d68747470732533412532462532466769746875622e6769746875626173736574732e636f6d253246696d6167657325324667726176617461727325324667726176617461722d757365722d3432302e706e6726723d6726733d3430"
};

export default defaults;