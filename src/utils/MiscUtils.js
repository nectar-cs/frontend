import React from 'react'
import layouts from './../assets/content-layouts.sass'
import DataUtils from './DataUtils';

const GCP_BASE = "https://storage.googleapis.com/";
const IMG_BASE = GCP_BASE + "nectar-mosaic-public/images";

export default class MiscUtils {

  static image(name){
    return `${IMG_BASE}/${name}`;
  }

  static frameworkImage(framework){
    const imageName = `${framework}/${framework}-plain.svg`;
    return `${IMG_BASE}/frameworks/${imageName}`;
  }

  static coolCross(callback){
    let attrs = {background: 'white', marginLeft: "34px", padding: "0 17px  "};
    return(
      <div className={layouts.horizonBoxWrapper}>
        <div className={layouts.horizontalLine}/>
        { callback(attrs) }
      </div>
    )
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
    return ["javascript", "go", "ruby", "c"];
  }
}
