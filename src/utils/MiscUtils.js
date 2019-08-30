import React from 'react'
import layouts from './../assets/content-layouts.sass'
import DataUtils from './DataUtils';

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

  static positiveMod(n, m){
    return ((n % m) + m) % m;
  }

  static veryEasyOptions(transform, ...strings) {
    const doubled = strings.map((string) =>
      transform ? transform(string) : string
    );
    const tuples = DataUtils.bigHash(doubled);
    return this.easyOptions(tuples);
  }

  static arrayOptions(options){
    return options.map(option => (
      <option key={option} value={option}>
        { option }
      </option>
    ));
  }

  static easyOptions(nullOption, tuples) {
    const options = tuples.map((tuple) => {
      const key = Object.keys(tuple)[0].toString();
      const value = tuple[key];
      return(
        <option key={key} value={key} >
          {value}
        </option>
      )
    });
    if(nullOption)
      options.unshift(this.emptyOption(nullOption));
    return options;
  }

  static frameworkChoices(){
    return ["docker", "javascript", "go", "ruby", "c"];
  }
}
