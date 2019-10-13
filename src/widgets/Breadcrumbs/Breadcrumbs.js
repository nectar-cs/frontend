import React from 'react'
import PropTypes from 'prop-types'
import S from './BreadcrumbStyles'

function Crumb({url, name}){
  return(
    <a href={url}><S.Crumb>{name}</S.Crumb></a>
  )
}

export default function Breadcrumbs(props){
  const slash = <S.Slash>></S.Slash>;
  const crumbs = props.parts.map(part => (
    <Crumb key={part.name} {...part} />
  ));
  const Glued = ()=>crumbs.reduce((prev, curr) => [prev, slash, curr]);
  return<S.Container><Glued/></S.Container>;
}

Breadcrumbs.propTypes = {
  parts: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    })
  )
};