import React from 'react';
import { Link } from 'react-router-dom';

export default function ModestLink(props) {
  const style = { textDecoration: 'none' };
  return (
    <Link to={props.to} style={style}>
      {props.children}
    </Link>
  );
}
