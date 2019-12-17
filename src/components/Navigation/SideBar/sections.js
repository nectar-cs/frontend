import IntegrationsModal from '../../../modals/IntegrationsModal/IntegrationsModal';
import SoftwareUpdateModal from '../../../modals/SoftwareUpdateModal/SoftwareUpdateModal';

const workbench = {
  title: 'Workbench',
  icon: 'developer_board',
  items: [
    {
      identifier: 'workspaces',
      title: 'Workspaces',
      path: '/workspaces',
      eager: true,
    },
    { title: 'Observatory', path: '/observatory' },
    { title: 'Playground', path: '/playground' },
  ],
};

const laboratory = {
  title: 'Laboratory',
  icon: 'highlight',
  items: [
    { title: 'Experiments', path: '/experiments' },
    { title: 'Regression Tests', path: '/regression-testing' },
    { title: 'Compliance', path: '/compliance' },
  ],
};

const canteen = {
  title: 'Cost Control',
  icon: 'money_off',
  items: [
    { title: 'Dev Policies', path: '/cost-policies' },
    { title: 'Efficacy Analysis', path: '/cost-policy-analysis' },
  ],
};

const settings = {
  title: 'Settings',
  icon: 'settings',
  items: [
    { title: 'Git & Docker', modal: IntegrationsModal },
    { title: 'Bulk Matching', path: '/bulk-matching' },
    { title: 'Software Update', modal: SoftwareUpdateModal }
  ],
};

const sections = [workbench, laboratory, canteen, settings];
export default sections;
