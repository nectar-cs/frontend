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
    podDebug: {
      title: "Pods not Creating",
      iconName: "pause_circle_outline",
      demo: "Pod y u always say pending?"
    },
    accessDebug: {
      title: "Access Woes",
      iconName: 'gavel',
      demo: "Y u so insecure?"
    },
    ingressDebug: {
      title: "Routing/Ingress",
      iconName: 'settings_ethernet',
      demo: "Y u no route /foo to /bar?"
    }
  },
  submit: "Start Wizard"
};

export default defaults;