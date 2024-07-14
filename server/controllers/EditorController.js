const { ReadSpecificFile, SaveFileContents, CreateFile } = require("../services/FileServices");

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

const DeleteFileOrFolderController = async (req, res) => {
    const { filePath, clerkID } = req.body;

    if (filePath && clerkID) {
        if (await DeleteFileOrFolder(filePath) === true) {
            return res.json({
                success: true,
                message: "File or folder deleted successfully"
            });
        } else {
            return res.json({
                success: false,
                message: "Error occurred"
            });
        }
    } else {
        return res.json({
            success: false,
            message: "Insufficient Data"
        });
    }
};

const RenameFileOrFolderController = async (req, res) => {
    const { oldPath, newName, clerkID } = req.body;

    if (oldPath && newName && clerkID) {
        if (await RenameFileOrFolder(oldPath, newName) === true) {
            return res.json({
                success: true,
                message: "File or folder renamed successfully"
            });
        } else {
            return res.json({
                success: false,
                message: "Error occurred"
            });
        }
    } else {
        return res.json({
            success: false,
            message: "Insufficient Data"
        });
    }
};

const CreateNewFolderController = async (req, res) => {
    const { directoryPath, folderName, clerkID } = req.body;

    if (directoryPath && folderName && clerkID) {
        if (await CreateNewFolder(directoryPath, folderName) === true) {
            return res.json({
                success: true,
                message: `${folderName} created successfully`
            });
        } else {
            return res.json({
                success: false,
                message: "Error occurred"
            });
        }
    } else {
        return res.json({
            success: false,
            message: "Insufficient Data"
        });
    }
};

module.exports = {
    ReadfileContents,
    SaveCurrentFile,
    CreateNewFile
}