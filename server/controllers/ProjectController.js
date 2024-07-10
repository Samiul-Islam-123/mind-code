const ProjectModel = require("../models/ProjectModel")
const path = require("path");
const UserModel = require("../models/UserModel");
const { CreateDirectory } = require("../services/FolderServices");

const rootdirectory = path.resolve(__dirname, "../../");
const projectDirectory = path.join(rootdirectory, 'Projects');

const createProject = async (req, res) => {
    try {
        const { Projectname, clerkID, description } = req.body;

        if (!Projectname || !clerkID)
            return res.json({
                success: false,
                message: "Invalid data"
            })

        //extract mongoDB document ID of owner
        const Owner = await UserModel.findOne({
            clerkID : clerkID
        })

        if(!Owner){
        
        return res.json({
                success: false,
                message: "Owner not found"
            })
        }

        //create folder for project
        const ProjectPath = path.join(projectDirectory, Owner._id.toString(), Projectname)
        console.log(ProjectPath)
        CreateDirectory(Projectname, ProjectPath)

        const NewProject = new ProjectModel({
            Projectname : Projectname,
            owner : Owner._id,
            ProjectPath : ProjectPath,
            description : description
        })

        await NewProject.save();
    }
    catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Server error"
        })
    }
}

module.exports = {createProject}