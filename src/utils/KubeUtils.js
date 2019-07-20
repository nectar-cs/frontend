// @flow

const exec = require('child_process').exec;

export default class KubeUtils {
  static execute(command, callback):  void {
    exec(command, (error, stdout, stderr) => {
      // console.log(`${command} ER: ${error}`);
      // console.log(`${command} SO ${stdout}`);
      // console.log(`${command} SE ${stderr}`);
      callback(stdout, stderr);
    });
  };
}