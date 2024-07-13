const { ReadSpecificFile, SaveFileContents } = require("../services/FileServices");

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

module.exports = {
    ReadfileContents,
    SaveCurrentFile
}