import React from 'react';
import Backend from '../../../utils/Backend';
import CenterLoader from '../../../widgets/CenterLoader/CenterLoader';
import { Redirect } from 'react-router';
import AppLayout from '../../Navigation/AppLayout/AppLayout';

export default class DefaultWorkspace extends React.Component {
  constructor(props) {
    super(props);
    this.state = { goTo: null };
  }

  async componentDidMount() {
    const workspace = await Backend.bFetch('/workspaces/default');
    const goTo = `/workspaces/${workspace ? workspace.id : ''}`;
    this.setState(s => ({ ...s, goTo }));
  }

  render() {
    const { goTo } = this.state;
    if (goTo) return <Redirect to={goTo} />;
    else {
      return (
        <AppLayout skipSetup={true}>
          <CenterLoader />
        </AppLayout>
      );
    }
  }
}
