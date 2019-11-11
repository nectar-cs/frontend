import React, {useEffect} from "react";
import Kapi from "../../utils/Kapi";
import Backend from "../../utils/Backend";
import UpdateChecker from "../../utils/UpdateChecker";
import MiscUtils from "../../utils/MiscUtils";

export default function Debug(){

  const All = () => Object.keys(process.env).map(key => (
    <li key={key}><p>{key}: {process.env[key]}</p></li>
  ));

  const checker = new UpdateChecker();
  let kapiVersion = null;
  let verdict = null;

  useEffect(() => {
    checker.fetchKapiVersion().then(r => {
      console.log("HEY");
      console.log(r);
      kapiVersion = r;
    })
  }, []);

  useEffect(() => {
    checker.fetchVerdict().then(r => {
      verdict = r;
  })});

  return(
    <ul>
      <li><p>Node Env: {process.env.NODE_ENV}</p></li>
      <li><p>Backend URL: {backendURL()}</p></li>
      <li><p>REVISION: {revision()}</p></li>
      <li><p>Backend: {Backend.baseUrl()}</p></li>
      <li><p>Kapi: {Kapi.baseUrl()}</p></li>
      <li><p>Non Dev: {checker.isNonDevEnvironment().toString()}</p></li>
      <li><p>Was last check long ago: {checker.wasLastCheckAgesAgo().toString()}</p></li>
      <li><p>Last Check: {checker.lastCheckTime().format()}</p></li>
      <li><p>furthestBackAcceptableCheckTime: {checker.furthestBackAcceptableCheckTime().format()}</p></li>
      <li><p>Should Perform: {checker.shouldPerform().toString()}</p></li>
      <li><p>Kapi version: {JSON.stringify(kapiVersion)}</p></li>
      <li><p>Update verdict: {JSON.stringify(verdict)}</p></li>
      <li><p>MP: {MiscUtils.MP_TOKEN}</p></li>
      <li><p>Sentry: {MiscUtils.SENTRY_DSN}</p></li>
      <li><p>Sanity: 3</p></li>

      <li><p>---</p></li>
      <All/>
    </ul>
  )
}

function backendURL(){
  try{ return BACKEND_URL } catch { return ""; }
}

function revision(){
  try{ return REVISION } catch { return ""; }
}
