import React from 'react'
import s from './CenterAnnouncement.sass'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom';

function MainContent(props){
  if (props.contentType === "action"){
    return (
      <div className={s.clickableContainer} onClick={props.action}>
        <i className={`material-icons ${s.containerIcon}`}>{props.iconName}</i>
        <p className={s.containerText}>{props.text}</p>
      </div>
    )
  } else if (props.contentType === 'children') {
    return(
      <div className={s.clickableContainer}>
        <i className={`material-icons ${s.containerIcon}`}>{props.iconName}</i>
        { props.children }
      </div>
    )
  } else {
    return(
      <div className={s.clickableContainer}>
        <i className={`material-icons ${s.containerIcon}`}>{props.iconName}</i>
        <p className={s.containerText}>{props.text}</p>
      </div>
    )
  }
}

export default function CenterAnnouncement(props){
  if(props.contentType === 'nav-link'){
    return(
      <NavLink to={props.action}>
        <MainContent {...props}/>
      </NavLink>
    )
  } else return <MainContent {...props} />
}

const commonProps = {
  iconName: PropTypes.string.isRequired,
  text: PropTypes.string,
  action: PropTypes.any,
  contentType: PropTypes.oneOf(['action', 'nav-link', 'children']).isRequired
};

MainContent.propTypes = commonProps;
CenterAnnouncement.propTypes = commonProps;
CenterAnnouncement.defaultProps = { contentType: 'action' };
