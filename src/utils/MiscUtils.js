import React from 'react'
import layouts from './../assets/content-layouts.sass'
import DataUtils from './DataUtils';
import textCombos from './../assets/text-combos.sass'

const GCP_BASE = "https://storage.googleapis.com/";
const IMG_BASE = GCP_BASE + "nectar-mosaic-public/images";

export default class MiscUtils {
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


  static frameworkChoices(){
    return ["docker", "javascript", "go", "ruby", "c"];
  }
}