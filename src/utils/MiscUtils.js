//@flow
import React, {Fragment} from 'react'
import textCombos from './../assets/text-combos.sass'
import Text from './../assets/text-combos'
import moment from "moment";
import type {Matching} from "../types/Types";
import * as Sentry from "@sentry/browser";
const GCP_BASE = "https://storage.googleapis.com/";
const IMG_BASE = GCP_BASE + "nectar-mosaic-public/images";
import mixpanel from 'mixpanel-browser';

export default class MiscUtils {

  static MP_TOKEN = MiscUtils.tor(() => MIXPANEL_TOKEN);
  static SENTRY_DSN = MiscUtils.tor(() => SENTRY_DSN);

  static hasMixPanel(){ return !!this.MP_TOKEN; }
  static hasSentry(){ return !!this.SENTRY_DSN; }

  static tor(func, fallback){
    try{ return func() }
    catch (_) { return fallback || null; }
  }

  static image(name){
    return `${IMG_BASE}/${name}`;
  }

  static depMatching(deploymentName: string, matchings: Matching[]){
    return matchings.find(matching => (
      matching.deploymentName === deploymentName
    ));
  }

  static frameworkImage(framework, suffix='plain.svg'){
    const imageName = `${framework}/${framework}-${suffix}`;
    return `${IMG_BASE}/icons/${imageName}`;
  }

  static msImage(deployment, matching){
    const name = matching && matching.framework ? matching.framework : "docker";
    return this.frameworkImage(name);
  }

  static sourceString(commit){
    const { branch, message } = (commit || {});
    if(branch && message){
      const commitPart = `"${message.substring(0, 10)}..."`;
      return `${commitPart} on ${branch}`;
    } else return "Not annotated :(";
  }

  static portMappingsStr(bundles){
    const array = bundles.map(p => `${p.toPort} <-- ${p.fromPort}`);
    return array.join(', ')
  }

  static commitGHPath(commit, matching){
    const {gitRemoteId, gitRepoName} = matching;
    return `/remotes/${gitRemoteId}/${gitRepoName}/commit/${commit.sha}`;
  }

  static latestPodTs(pods){
    pods = (pods || []).filter(p => !!p.updatedAt);
    if(!pods) return null;

    const stamps = pods.map(p => moment(p.updatedAt));
    const greatest = moment.max(stamps);
    return moment(greatest).calendar();
  }

  static modalImage(inst, icon){
    const { deployment, matching, mode } = inst.props;
    if(!mode || mode === 'modal'){
      return this.msImage(deployment, matching);
    } else return icon;
  }

  static modalGraphicType(inst){
    const { mode } = inst.props;
    return !mode || mode === 'modal' ? 'image' : 'icon';
  }

  static gitSummary(ms, extended){
    if(!ms) return "An unmatched deployment";

    const first = (
      <Text.A href={`https://www.github.com/${ms.gitRemoteName}`} target="_blank">
        {ms.gitRemoteName}@github
      </Text.A>
    );

    const url = `https://www.github.com/${ms.gitRemoteName}/${ms.gitRepoName}`;
    const second = (
      <Text.A href={url} target="_blank">
        {ms.gitRepoName}
      </Text.A>
    );

    const third = extended && ms.dockerBuildPath &&
      <Text.A pushed>{ms.dockerBuildPath}</Text.A>;

    return <Fragment>{first} / {second}{third}</Fragment>;
  }

  static isJson(str){
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }

  static arrayOfHashesOptions(options){
    return options.map(option => (
      <option key={option['value']} value={option['value']}>
        { option['show'] }
      </option>
    ));
  }

  static arrayOptions(options){
    return options.map(option => (
      <option key={option} value={option}>
        { option }
      </option>
    ));
  }

  static hashOptions(options){
    return Object.keys(options).map((key) => (
      <option key={key} value={key}>
        { options[key] }
      </option>
    ));
  }

  static statusCodeColors(code){
    if(code < 300) return textCombos.statusTagSuccess;
    else if(code < 500 ) return textCombos.statusTagWarn;
    else if(code < 600) return textCombos.statusTagFailure;
    else return null;
  }

  static httpVerbColors(verb){
    verb = verb.toLowerCase();
    if(verb === 'get')
      return textCombos.statusTagGood;
    else if(['post', 'patch', 'put'].includes(verb))
      return textCombos.statusTagReady;
    else return textCombos.statusTagWarn;
  }

  static areMatchesEquiv(m1, m2){
    if(m1.id !== m2.id) return false;
    if(m1.gitRemoteName !== m2.gitRemoteName) return false;
    if(m1.id !== m2.id) return false;
    if(m1.id !== m2.id) return false;
  }

  static senTrack(e){
    Sentry.captureException(e);
  }

  static mp(name, hash){
    try{
      if(this.hasMixPanel()){
        mixpanel.track(name, hash);
      }
    } catch (e) {
      this.senTrack(e);
      console.log("MP FAIL " + e);
    }
  }
}