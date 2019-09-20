import PropTypes from "prop-types";

const Service = PropTypes.shape({
  name: PropTypes.string.isRequired,
  fromPort: PropTypes.number.isRequired,
  toPort: PropTypes.number.isRequired,
  internalIp: PropTypes.string,
  externalIp: PropTypes.string,
  shortDns: PropTypes.string.isRequired,
  longDns: PropTypes.string.isRequired
});

const Deployment = PropTypes.shape({
  name: PropTypes.string.isRequired,
  imageName: PropTypes.string.isRequired,
  replicas: PropTypes.number.isRequired,
  pods: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      state: PropTypes.oneOf(['Running', 'Failed', 'Pending', 'Unknown'])
    })
  ).isRequired,
  services: PropTypes.arrayOf(Service)
});

const Matching = PropTypes.shape({
  framework: PropTypes.string.isRequired,
  gitRemoteName: PropTypes.string,
  gitRepoName: PropTypes.string
});

export const Types = { Service, Deployment, Matching };