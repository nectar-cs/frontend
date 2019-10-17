import {makeRoute, ROUTES} from "../../containers/RoutesConsts";

const defaults = {
  header: {
    title: (name, mode)=> {
      if(mode === 'modal') return `${name} / infra debugging`;
      else return `Infra Debugging`;
    },
    subtitle: `Starting point for debugging a deployment`
  },
  activities: {
    networkingDebug: {
      title: "Networking BS",
      iconName: "settings_input_hdmi",
      path: (base, ns, dep) => (
        makeRoute(base, {ns, id: dep, type: 'network'})
      )
    },
    certsDebug: {
      title: "Certificate BS",
      iconName: 'lock_open'
    },
    podDebug: {
      title: "Pods not Running",
      iconName: "pause_circle_outline"
    },
    accessDebug: {
      title: "Access Woes",
      iconName: 'gavel'
    },
    ingressDebug: {
      title: "Routing/Ingress",
      iconName: 'settings_ethernet'
    }
  },
  healthChecks: {
    title: "Auto Diagnosis",
    comingSoon: "The idea here is to guess what's not working."
  },

  submit: "Start Wizard"
};

export default defaults;