import React from "react";

export default function Debug(){

  const All = () => Object.keys(process.env).map(key => (
    <li key={key}><p>{key}: {process.env[key]}</p></li>
  ));

  return(
    <ul>
      <li><p>Node Env: {process.env.NODE_ENV}</p></li>
      <li><p>Backend URL: {process.env.REACT_APP_BACKEND_URL}</p></li>
      <li><p>Backend URL: {BACKEND_URL}</p></li>
      <li><p>---</p></li>
      <All/>
    </ul>
  )
}