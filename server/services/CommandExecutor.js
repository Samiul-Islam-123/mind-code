const shell = require('shelljs');
const commandsTemplates = require('./Templates');

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

const startProject = async (templateName) => {
  try {
    const template = commandsTemplates.find(t => t.template === templateName);
    if (!template) {
      throw new Error(`Template ${templateName} not found`);
    }

    // Run the server and client commands in separate terminals for MERN
    if (templateName === 'mern') {
      console.log(`Starting server: ${template.run[0]}`);
      runCommand(template.run[0]);

      console.log(`Starting client: ${template.run[1]}`);
      runCommand(template.run[1]);
    } else {
      for (const command of template.run) {
        console.log(`Running command: ${command}`);
        await runCommand(command);
      }
    }

  } catch (error) {
    console.error(`Error starting project: ${error.message}`);
  }
};

module.exports = {
  runCommand,
  startProject
};
