const {runCommand} = require("./CommandExecutor");

const shell = require('shelljs');
const commandsTemplates = require("./Templates");





const createTemplate =async (templateName, projectPath) => {
    const template = commandsTemplates.find(t => t.template === templateName);
    
    console.log(projectPath)
    
    shell.cd(projectPath)
    
    if(template)
    {
        for(const cmd of template.commands){
            console.log("Running command : "+cmd)
            console.log (await runCommand(cmd))
        }
    }
}

module.exports = createTemplate;