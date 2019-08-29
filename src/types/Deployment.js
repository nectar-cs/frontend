import PropTypes from "prop-types";

export const FULL_DEPLOYMENT = {
  deployment: PropTypes.shape({
    name: PropTypes.string.isRequired,
    imageName: PropTypes.string.isRequired,
    pods: PropTypes.arrayOf({
      name: PropTypes.string.isRequired,
      state: PropTypes.oneOf(['Running', 'Failed', 'Pending', 'Unknown'])
    }).isRequired,
    services: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        fromPort: PropTypes.number.isRequired,
        toPort: PropTypes.number.isRequired,
        internalIp: PropTypes.string,
        externalIp: PropTypes.string,
        shortDns: PropTypes.string.isRequired,
        longDns: PropTypes.string.isRequired
      })
    )
  }).isRequired
};