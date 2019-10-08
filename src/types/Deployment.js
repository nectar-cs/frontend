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

const CommitChange = PropTypes.shape({
  filename: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  blobUrl: PropTypes.string.isRequired,
  patch: PropTypes.string.isRequired,
});

const DetailedCommit = PropTypes.shape({
  sha: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  timestamp: PropTypes.string.isRequired,
  authorAvatar: PropTypes.string,
  authorUrl: PropTypes.string,
  changes: PropTypes.arrayOf(CommitChange)
});

const Deployment = PropTypes.shape({
  name: PropTypes.string.isRequired,
  namespace: PropTypes.string.isRequired,
  imageName: PropTypes.string.isRequired,
  replicas: PropTypes.number.isRequired,
  pods: PropTypes.arrayOf(LightPod).isRequired,
  services: PropTypes.arrayOf(Service).isRequired,
  commit: AnnotatedCommit
});

const Matching = PropTypes.shape({
  framework: PropTypes.string.isRequired,
  gitRemoteName: PropTypes.string,
  gitRepoName: PropTypes.string,
  gitRemoteId: PropTypes.number,
  imgRemoteId: PropTypes.number
});

export const Types = {
  Service,
  Deployment,
  Matching,
  Commit,
  DetailedCommit,
  CommitChange
};