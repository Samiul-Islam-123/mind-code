const runCommand = require("./CommandExecutor");

const shell = require('shelljs');

const commandsTemplates = [
    {
        template : "html",
        commands : [
            "touch index.html",
            "touch script.js",
            "touch style.css"
        ]
    },
    {
        template : "react",
        commands : [
            "npx create-react-app app"
        ]
    },
    {
        template : "node",
        commands : [
            "npm init -y",
            "touch index.js"
        ]
    },
    {
        template : "mern",
        commands : [
            "npx create-react-app client",
            "mkdir server",
            "cd server",
            "npm init -y",
            "touch index.js"
        ]
    }
]

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