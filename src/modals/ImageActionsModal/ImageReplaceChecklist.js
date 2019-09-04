import React from 'react'

export default class ImageReplaceChecklistManager {



  static generate(){
    return [
      { name: "Old pods all gone", detail: "1/3", state: 'idle' },
      { name: "New pods all created", progress: "Failed", state: 'working' },
      { name: "New pods all running", progress: '2/2', state: 'done' },
    ];
  }

}
