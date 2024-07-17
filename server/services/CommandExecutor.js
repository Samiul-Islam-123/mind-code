const shell = require('shelljs');

const runCommand = (cmd) => {
  return new Promise((resolve, reject) => {
    shell.exec(cmd, (code, stdout, stderr) => {
      if (code !== 0) {
        reject(new Error(stderr));
      } else {
        resolve(stdout);
      }
    });
  });
};


module.exports = runCommand;
