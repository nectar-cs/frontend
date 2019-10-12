const defaults = {
  sections: {
    infraDebug: {
      title: "Debugging & Troubleshooting",
      iconName: "bug_report",
      activities: {
        networkingDebug: {
          title: "Simple Networking",
          iconName: "settings_input_hdmi",
        },
        podDebug: {
          title: "Pods not Running",
          iconName: "pause_circle_outline"
        },
      }
    },

    imageOps: {
      title: "Image Operations",
      iconName: "camera_alt"
    },

    integrations: {
      title: "Git & Docker",
      iconName: "attachment"
    },

    logging: {
      title: "Logging",
      iconName: "format_list_bulleted"
    },

    shell: {
      title: "Interactive Shell",
      iconName: "touch_app"
    },

    commands: {
      title: "Command Execution",
      iconName: "attach_money"
    },

    cost: {
      title: "Cost Analysis",
      iconName: "account_balance"
    },

    portForward: {
      title: "Port Forwarding",
      iconName: "arrow_upward"
    },
    httpOps: {
      title: "HTTP Operations",
      iconName: "http"
    }
  }
};

export default defaults;