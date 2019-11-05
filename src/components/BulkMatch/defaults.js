const defaults = {
  previewTitle: "Matching Git and Docker Repos",
  previewIntro: "Point this deployment to its Git and Docker repos. " +
    "This makes Mosaic do lots of useful things.",
  integration: {
    reason: "For matching, you need to connect to Git and/or Docker.",
    skip: "If you chose to skip, you will proceed to the application."
  },
  previewButtons: {
    negative: {
      tutorial: "Skip this one",
      detail: "Delete Matching"
    },
    positive: {
      tutorial: "Confirm & Next",
      detail: "Save"
    }
  }
};

export { defaults as default };