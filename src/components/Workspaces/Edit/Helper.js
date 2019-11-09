import Kapi from "../../../utils/Kapi";

export default class Helper {
  static fetchDeployments(props=this.props){
    const ns = props.namespaces;
    const nsFilterType = `ns_filter_type=${ns.filterType}`;
    const nsFilter = `ns_filters=${ns.filters.join(',')}`;

    const lb = props.labels;
    const lbFilterType = `lb_filter_type=${lb.filterType}`;
    const lbFilter = `lb_filters=${lb.filters.join(',')}`;

    const base = '/api/deployments/filtered';
    const args = `${nsFilterType}&${nsFilter}&${lbFilterType}&${lbFilter}`;
    const endpoint = `${base}?${args}`;

    this.setState(s => ({...s, isFetching: true}));
    Kapi.fetch(endpoint, (response) => {
      this.setState((s) => ({...s, deployments: response['data']}));
      this.setState(s => ({...s, isFetching: false}));
    });
  }

}

