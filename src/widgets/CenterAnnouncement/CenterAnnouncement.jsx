import React from 'react'
import s from './CenterAnnouncement.sass'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom';

function mainContent(props){
  return(
    <div className={s.container} onClick={props.action}>
      <i className={`material-icons ${s.containerIcon}`}>{props.iconName}</i>
      <p className={s.containerText}>{props.text}</p>
    </div>
  )
}

export default function CenterAnnouncement(props){
  if(props.contentType === 'nav-link'){
    return(
      <NavLink to={props.routeTo}>
        { mainContent(props) }
      </NavLink>
    )
  } else {
    return mainContent(props);
  }
}

CenterAnnouncement.propTypes = {
  routeTo: PropTypes.string
};