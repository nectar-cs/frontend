import React from "react";

export default function Debug(){

  const All = () => Object.keys(process.env).map(key => (
    <li key={key}><p>{key}: {process.env[key]}</p></li>
  ));

  function backendURL(){
    try{ return BACKEND_URL } catch { return ""; }
  }

  function revision(){
    try{ return REVISION } catch { return ""; }
  }

  function revision2(){
    try{ return REACT_APP_REVISION } catch { return ""; }
  }

  return(
    <ul>
      <li><p>Node Env: {process.env.NODE_ENV}</p></li>
      <li><p>Backend URL: {process.env.REACT_APP_BACKEND_URL}</p></li>
      <li><p>Backend URL: {backendURL()}</p></li>
      <li><p>REVISION: {revision()} {process.env.REVISION}</p></li>
      <li><p>REVISION2: {revision2()} {process.env.REACT_APP_REVISION}</p></li>
      <li><p>---</p></li>
      <All/>
    </ul>
  )
}