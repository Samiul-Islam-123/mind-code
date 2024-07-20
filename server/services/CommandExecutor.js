const shell = require('shelljs');
const commandsTemplates = require('./Templates');
const path = require('path');

const runCommand = (cmd) => {
  return new Promise((resolve, reject) => {
    shell.exec(cmd, { async: true }, (code, stdout, stderr) => {
      if (code !== 0) {
        reject(new Error(stderr));
      } else {
        resolve(stdout);
      }
    });
  });
};

const startApplication = async (startFilePath, startFileName, processName, templateName, ProjectName) => {
  console.log(templateName)
  shell.cd(startFilePath);
  console.log("Changed dir to: " + startFilePath);
  let commandToRun;
  if (templateName === 'node') {

    await runCommand(`npm install`);
    const startFile = path.join(startFilePath, startFileName);
    commandToRun = `pm2 start ${startFile} --name ${processName}`
  }

  else if (templateName === 'react') {
    shell.cd('app')
    commandToRun = `pm2 start npm --name "${processName}" -- start`
  }
  console.log(commandToRun)
  const commandOutput = await runCommand(commandToRun);
  return commandOutput;
};

const stopApplication = async (processName) => {
  console.log("Stopping PM2 process..." + processName);
  const commandOutput = await runCommand(`pm2 stop ${processName}`);
  return commandOutput;
};

const restartApplication = async (startFilePath, startFileName, processName, templateName, ProjectName) => {
  await stopApplication(processName);
  //shell.cd(startFilePath);
  //await runCommand(`npm install`);
  const commandOutput = await startApplication(startFilePath, startFileName, processName, templateName, ProjectName);
  return commandOutput;
};

module.exports = {
  runCommand,
  startApplication,
  stopApplication,
  restartApplication
};
