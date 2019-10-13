import IntegrationsModal from "../../../modals/IntegrationsModal/IntegrationsModal";

const workbench = {
  title: 'Workbench',
  icon: 'developer_board',
  items: [
    {
      key: 'workspaces',
      title: "Workspaces",
      path: '/workspaces',
      eager: true
    },
    { title: "Playground", path: '/1' },
    { title: "Observatory", path: '/2' }
  ]
};

const laboratory = {
  title: 'Laboratory',
  icon: 'highlight',
  items: [
    { title: "Experiments", path: '/1' },
    { title: "Regression Tests", path: '/2' },
    { title: "Compliance", path: '/3' }
  ]
};

const canteen = {
  title: 'Cost Control',
  icon: 'money_off',
  items: [
    { title: "Policies", path: '/1' },
    { title: "Trend & Analysis", path: '/2' },
    { title: "Predictions", path: '/3' }
  ]
};

const settings = {
  title: 'Settings',
  icon: 'settings',
  items: [
    { title: "Git & Docker", modal: IntegrationsModal },
    { title: "Deployment Matching", path: '/deployments/detect' },
  ]
};

const sections = [workbench, laboratory, canteen, settings];
export default sections;
