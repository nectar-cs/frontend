import PropTypes from "prop-types";

const POD_STATES = ['Running', 'Failed', 'Pending', 'Unknown'];

const Service = PropTypes.shape({
  name: PropTypes.string.isRequired,
  fromPort: PropTypes.number.isRequired,
  toPort: PropTypes.number.isRequired,
  internalIp: PropTypes.string,
  externalIp: PropTypes.string,
  shortDns: PropTypes.string.isRequired,
  longDns: PropTypes.string.isRequired
});

const LightPod = PropTypes.shape({
  name: PropTypes.string.isRequired,
  state: PropTypes.oneOf(POD_STATES)
});

const Commit = PropTypes.shape({
  sha: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  timestamp: PropTypes.string.isRequired
});

const AnnotatedCommit = PropTypes.shape({
  sha: PropTypes.string,
  branch: PropTypes.string,
  message: PropTypes.string,
});

const Deployment = PropTypes.shape({
  name: PropTypes.string.isRequired,
  namespace: PropTypes.string.isRequired,
  imageName: PropTypes.string.isRequired,
  replicas: PropTypes.number.isRequired,
  pods: PropTypes.arrayOf(LightPod).isRequired,
  services: PropTypes.arrayOf(Service),
  commit: AnnotatedCommit
});

const Matching = PropTypes.shape({
  framework: PropTypes.string.isRequired,
  gitRemoteName: PropTypes.string,
  gitRepoName: PropTypes.string,
  gitRemoteId: PropTypes.number,
  imgRemoteId: PropTypes.number
});

export const Types = { Service, Deployment, Matching, Commit };