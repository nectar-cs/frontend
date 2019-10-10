import React from 'react'
import PropTypes from 'prop-types'
import S from './BreadcrumbStyles'

export default function Breadcrumbs(props){

  function makeCrumb(part){
    return(
      <a href={part.url} key={part.url}>
        <S.Crumb>
          {part.name}
        </S.Crumb>
      </a>
    )
  }

  const slash = <S.Slash>></S.Slash>;
  const crumbs = props.parts.map(part => makeCrumb(part));
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