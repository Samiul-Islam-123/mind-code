const runCommand = require("./CommandExecutor");

const shell = require('shelljs');

const commandsTemplates = [
    {
        template: "html",
        commands: [
            "touch index.html && echo '<!DOCTYPE html>\\n<html lang=\"en\">\\n<head>\\n<meta charset=\"UTF-8\">\\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\\n<title>Document</title>\\n<link rel=\"stylesheet\" href=\"style.css\">\\n</head>\\n<body>\\n<script src=\"script.js\"></script>\\n</body>\\n</html>' > index.html",
            "touch script.js && echo 'document.addEventListener(\"DOMContentLoaded\", () => {\\n    console.log(\"Hello, World!\");\\n});' > script.js",
            "touch style.css && echo 'body {\\n    font-family: Arial, sans-serif;\\n    margin: 0;\\n    padding: 0;\\n}' > style.css"
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
            "touch index.js && echo 'const express = require(\"express\");\\nconst app = express();\\nconst PORT = process.env.PORT || 3000;\\napp.get(\"/\", (req, res) => {\\n    res.send(\"Hello, World!\");\\n});\\napp.listen(PORT, () => {\\n    console.log(`Server is running on port ${PORT}`);\\n});' > index.js"
        ]
    },
    {
        template: "mern",
        commands: [
            "npx create-react-app client",
            "mkdir server",
            "sh -c 'cd server && npm init -y && touch index.js && echo \"const express = require(\\\"express\\\");\\nconst app = express();\\nconst PORT = process.env.PORT || 5000;\\napp.get(\\\"/\\\", (req, res) => {\\n    res.send(\\\"Hello from the server!\\\");\\n});\\napp.listen(PORT, () => {\\n    console.log(`Server is running on port ${PORT}`);\\n});\" > index.js'"
        ]
    }
];


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