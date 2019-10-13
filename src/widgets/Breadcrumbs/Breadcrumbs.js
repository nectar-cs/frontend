import React from 'react'
import PropTypes from 'prop-types'
import S from './BreadcrumbStyles'

function makeCrumb(part, i){
  return(
    <a href={part.url} key={i}>
      <S.Crumb>
        {part.name}
      </S.Crumb>
    </a>
  )
}

export default function Breadcrumbs(props){
  const slash = <S.Slash>></S.Slash>;
  const crumbs = props.parts.map((part, i) => makeCrumb(part, i));
  const assembled = crumbs.reduce((prev, curr) => [prev, slash, curr]);

  return(
    <S.Container>
      { assembled }
    </S.Container>
  );
}

Breadcrumbs.propTypes = {
  parts: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    })
  )
};