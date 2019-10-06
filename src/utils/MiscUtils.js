import React, {Fragment} from 'react'
import textCombos from './../assets/text-combos.sass'
import Text from './../assets/text-combos'

const GCP_BASE = "https://storage.googleapis.com/";
const IMG_BASE = GCP_BASE + "nectar-mosaic-public/images";

export default class MiscUtils {

  static tor(func){
    try{ return func() }
    catch (_) { return null; }
  }

  static image(name){
    return `${IMG_BASE}/${name}`;
  }
  static frameworkImage2(framework){
    return this.frameworkImage(framework, 'original.svg');
  }

  static frameworkImage(framework, suffix='plain.svg'){
    const imageName = `${framework}/${framework}-${suffix}`;
    return `${IMG_BASE}/icons/${imageName}`;
  }

  static msImage(deployment, matching){
    const name = matching ? matching.framework : "docker";
    return this.frameworkImage(name);
  }

  static gitSummary(ms){
    const first = (
      <Text.Discrete href={`https://www.github.com/${ms.gitRemoteName}`} target="_blank">
        {ms.gitRemoteName}
      </Text.Discrete>
    );

    const url = `https://www.github.com/${ms.gitRemoteName}/${ms.gitRepoName}`;
    const second = (
      <Text.Discrete href={url} target="_blank">
        {ms.gitRepoName}
      </Text.Discrete>
    );

    return <Fragment>{first} / {second}</Fragment>;
  }

  static emptyOption(text){
    return(
      <option
        value={'null'}
        key={'null'}>
        {text}
      </option>
    );
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
}