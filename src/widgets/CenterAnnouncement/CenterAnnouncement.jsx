import React from 'react'
import s from './CenterAnnouncement.sass'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom';

function MainContent(props){
  const containerStyle = props.action ? s.clickableContainer : s.container;
  return(
    <div className={s.clickableContainer} onClick={props.action}>
      <i className={`material-icons ${s.containerIcon}`}>{props.iconName}</i>
      <p className={s.containerText}>{props.text}</p>
    </div>
  )
}

export default function CenterAnnouncement(props){
  if(props.contentType === 'nav-link'){
    return(
      <NavLink to={props.routeTo}>
        <MainContent {...props}/>
      </NavLink>
    )
  } else return <MainContent {...props} />
}

const commonProps = {
  iconName: PropTypes.string.isRequired,
  text: PropTypes.string,
  action: PropTypes.func
};

MainContent.propTypes = commonProps;

CenterAnnouncement.propTypes = {
  routeTo: PropTypes.string,
  ...commonProps
};
