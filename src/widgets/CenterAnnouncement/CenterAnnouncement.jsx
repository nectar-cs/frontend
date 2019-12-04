import React from 'react';
import s from './CenterAnnouncement.sass';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

function MainContent(props) {
  const bkg = props.light ? s.light : null;
  const icon = <i className={`material-icons ${s.containerIcon} ${bkg}`}>{props.iconName}</i>;

  const text = <p className={s.containerText}>{props.text}</p>;

  if (props.contentType === 'action') {
    return (
      <div className={s.clickableContainer} onClick={props.action}>
        {icon}
        <p className={s.containerText}>{props.text}</p>
      </div>
    );
  } else if (props.contentType === 'children') {
    return (
      <div className={s.clickableContainer}>
        {icon} {props.children}
      </div>
    );
  } else {
    return (
      <div className={s.clickableContainer}>
        {icon} {text}
      </div>
    );
  }
}

export default function CenterAnnouncement(props) {
  if (props.contentType === 'nav-link') {
    return (
      <NavLink to={props.action}>
        <MainContent {...props} />
      </NavLink>
    );
  } else return <MainContent {...props} />;
}

const commonProps = {
  iconName: PropTypes.string.isRequired,
  text: PropTypes.string,
  action: PropTypes.any,
  light: PropTypes.bool,
  contentType: PropTypes.oneOf(['action', 'nav-link', 'children']).isRequired,
};

MainContent.propTypes = commonProps;
CenterAnnouncement.propTypes = commonProps;
CenterAnnouncement.defaultProps = { contentType: 'action' };
