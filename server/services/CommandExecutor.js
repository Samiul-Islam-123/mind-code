const shell = require('shelljs');
const fs = require('fs-extra');
const path = require('path');

const runCommand = (cmd) => {
  return new Promise(async (resolve, reject) => {
    const touchMatch = cmd.match(/^touch\s+(.*)$/);

    if (touchMatch) {
      const filePath = touchMatch[1];

      try {
        await fs.outputFile(filePath, path.basename(filePath));
        resolve(`File ${filePath} created and written to successfully.`);
      } catch (error) {
        reject(new Error(`Error writing to file: ${error.message}`));
      }
    } else {
      shell.exec(cmd, (code, stdout, stderr) => {
        if (code !== 0) {
          reject(new Error(stderr));
        } else {
          resolve(stdout);
        }
      });
    }
  });
};

module.exports = runCommand;
