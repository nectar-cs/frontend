import React from 'react'
import layouts from './../assets/content-layouts.sass'
import DataUtils from './DataUtils';

export default class MiscUtils {

  static image(name){
    const path = './nectar_mark_light.png';
    return path;
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

  static frameworkImage(framework){
    const base = "https://storage.googleapis.com/nectar-mosaic-public/images/frameworks";
    const imageName = `${framework}/${framework}-plain.svg`;
    return `${base}/${imageName}`;
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

  static frameworkChoices(withNull=true){
    // const fs = require('fs');
    // const dirName = `${__dirname}/../resources/images/frameworks/`;
    // const options = fs.readdirSync(dirName).map((name) =>
    //   <option key={name} value={name}>
    //     <p>{name}</p>
    //   </option>
    // );
    //
    // if(withNull){
    //   options.push(this.emptyOption('Framework'))
    // }
    //
    // return options;
  }



}
