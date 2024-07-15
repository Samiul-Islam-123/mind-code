const { ReadSpecificFile, SaveFileContents, CreateFile } = require("../services/FileServices");
const { CreateDirectory } = require("../services/FolderServices");

const ReadfileContents =async (req,res) => {
    const {filePath, clerkID} = req.params;

    
    if(filePath && clerkID){
        const fileContents =await ReadSpecificFile(filePath);
        if(fileContents!= false)
            return res.json({
                success : true,
                message : "Contents found",
                contents : fileContents
            })
    }

    else
    {
        return res.json({
            success : false,
            message : "Insufficient Data"
        })
    }
}

const SaveCurrentFile = async(req,res) => {
    const {filePath, fileContents, clerkID} = req.body;

    if(filePath && fileContents && clerkID){
        if(await SaveFileContents(filePath, fileContents) === true){
            return res.json({
                success : true,
                message : "File saved successfully"
            })
        }
    }   
    else
    {
        return res.json({
            success : false,
            message : "Insufficient Data"
        })
    }
}

const CreateNewFile = async(req,res) => {
    const {fileName, fileContent, directoryPath, clerkID} = req.body;

    if(fileName && fileContent && directoryPath && clerkID){
        if(await CreateFile(fileName, fileContent,directoryPath) === true){
            return res.json({
                success : true,
                message : fileName+" Created successfully"
            })
        }

        else{
            return res.json({
                success : false,
                message : "Error occured"
            })
        }
    }   
    else
    {
        return res.json({
            success : false,
            message : "Insufficient Data"
        })
    }
}

const CreateNewFolder = async(req,res) => {
    const {DirName, projectDirectory, clerkID} = req.body;
    if(DirName && projectDirectory && clerkID) {
        if(await CreateDirectory(DirName, projectDirectory) === true)
            
                return res.json({
                    success : true,
                    message : "Directory Created successfully"
                })
            
    }
}

module.exports = {
    ReadfileContents,
    SaveCurrentFile,
    CreateNewFile,
    CreateNewFolder
}