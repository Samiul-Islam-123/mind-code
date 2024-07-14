const runCommand = require("./CommandExecutor");
const shell = require('shelljs');

const commandsTemplates = [
    {
        template: "html",
        commands: [
            "echo '<!DOCTYPE html><html><head><title>My HTML Project</title></head><body><script src=\"script.js\"></script><link rel=\"stylesheet\" type=\"text/css\" href=\"style.css\"></body></html>' > index.html",
            "echo 'console.log(\"Hello, World!\");' > script.js",
            "echo 'body { font-family: Arial, sans-serif; }' > style.css"
        ]
    },
    {
        template: "react",
        commands: [
            "npx create-react-app app"
        ]
    },
    {
        template: "node",
        commands: [
            "npm init -y",
            "echo 'console.log(\"Hello, Node.js!\");' > index.js"
        ]
    },
    {
        template: "mern",
        commands: [
            "npx create-react-app client",
            "mkdir server",
            "cd server && npm init -y && echo 'const express = require(\"express\"); const app = express(); app.get(\"/\", (req, res) => res.send(\"Hello, MERN!\")); app.listen(3000, () => console.log(\"Server running on port 3000\"));' > index.js"
        ]
    }
];

const createTemplate = async (templateName, projectPath) => {
    const template = commandsTemplates.find(t => t.template === templateName);
    
    console.log(projectPath);
    
    shell.cd(projectPath);
    
    if (template) {
        for (const cmd of template.commands) {
            console.log("Running command: " + cmd);
            try {
                const output = await runCommand(cmd);
                console.log(output);
            } catch (error) {
                console.error("Error running command: " + cmd, error);
            }
        }
    }
};

module.exports = createTemplate;
