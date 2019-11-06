import IntegrationsModal from "../../../modals/IntegrationsModal/IntegrationsModal";

const workbench = {
  title: 'Workbench',
  icon: 'developer_board',
  items: [
    {
      identifier: 'workspaces',
      title: "Workspaces",
      path: '/workspaces',
      eager: true
    },
    { title: "Playground", path: '/playground' },
    { title: "Observatory", path: '/observatory' }
  ]
};

const laboratory = {
  title: 'Laboratory',
  icon: 'highlight',
  items: [
    { title: "Experiments", path: '/experiments' },
    { title: "Regression Tests", path: '/regression-testing' },
    { title: "Compliance", path: '/compliance' }
  ]
};

const canteen = {
  title: 'Cost Control',
  icon: 'money_off',
  items: [
    { title: "Policies", path: '/policies' },
    { title: "Trend & Analysis", path: '/cost-trends' },
    { title: "Predictions", path: '/cost-predictions' }
  ]
};

const settings = {
  title: 'Settings',
  icon: 'settings',
  items: [
    { title: "Git & Docker", modal: IntegrationsModal },
    { title: "Bulk Matching", path: '/bulk-matching' }
  ]
};

const sections = [workbench, laboratory, canteen, settings];
export default sections;