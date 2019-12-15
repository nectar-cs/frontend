import React from 'react';
import S from './CenterAnnouncementStyles'
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

function MainContent(props) {
  const icon = <S.ContainerIcon
    light={props.light}
    className='material-icons'>
    {props.iconName}
  </S.ContainerIcon>;

  const text = <S.ContainerText>{props.text}</S.ContainerText>;

  if (props.contentType === 'action') {
    return (
      <S.ClickableContainer onClick={props.action}>
        {icon}
        <S.ContainerText>
          {props.text}
        </S.ContainerText>
      </S.ClickableContainer>
    );
  } else if (props.contentType === 'children') {
    return (
      <S.ClickableContainer>
        {icon}
        {props.children}
      </S.ClickableContainer>
    );
  } else {
    return (
      <S.ClickableContainer>
        {icon}
        {text}
      </S.ClickableContainer>
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
