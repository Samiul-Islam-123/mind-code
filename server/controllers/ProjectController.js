const ProjectModel = require("../models/ProjectModel");
const path = require("path");
const UserModel = require("../models/UserModel");
const { CreateDirectory, ReadEverythingInDirectory, DeleteDirectory } = require("../services/FolderServices");
const createTemplate = require("../services/TemplateService");

const rootdirectory = path.resolve(__dirname, "../../");
const projectDirectory = path.join(rootdirectory, 'Projects');

const createProject = async (req, res) => {
    try {
        const { Projectname, clerkID, description, template } = req.body;

        if (!Projectname || !clerkID)
            return res.json({
                success: false,
                message: "Invalid data"
            });

        // Extract mongoDB document ID of owner
        const Owner = await UserModel.findOne({
            clerkID : clerkID
        });

        if (!Owner) {
            return res.json({
                success: false,
                message: "Owner not found"
            });
        }

        // Create folder for project
        const ProjectPath = path.join(projectDirectory, Owner._id.toString());
        CreateDirectory(Projectname, ProjectPath);

        await createTemplate(template, path.join(ProjectPath, Projectname))

        const NewProject = new ProjectModel({
            Projectname : Projectname,
            owner : Owner._id,
            ProjectPath : path.join(ProjectPath, Projectname),
            description : description
        });

        await NewProject.save();

        res.json({
            success : true,
            message : "Project Created Successfully",
            projectData : NewProject
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Server error"
        });
    }
}

const readProjectDetails = async (req, res) => {
    try {
        const { projectID, clerkID } = req.params;
        const User = await UserModel.findOne({
            clerkID : clerkID
        });
        const ProjectData = await ProjectModel.findOne({
            _id : projectID,
            owner : User._id
        }).populate('owner');

        if (!ProjectData) {
            return res.json({
                success : false,
                message : "Project data not found"
            });
        }

        const Data = ReadEverythingInDirectory(path.join(ProjectData.ProjectPath));
        res.json({
            success : true,
            message : "Project data found",
            projectData : ProjectData,
            Data : Data
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Server error"
        });
    }
}

const deleteProject = async (req, res) => {
    try {
        const { projectID, clerkID } = req.params;
        const User = await UserModel.findOne({
            clerkID : clerkID
        });
        const ProjectData = await ProjectModel.findOne({
            _id : projectID,
            owner : User._id
        });

        if (!ProjectData) {
            return res.json({
                success : false,
                message : "Project not found"
            });
        }

        // Delete the project directory
        console.log(path.join(ProjectData.ProjectPath ))
        DeleteDirectory(path.join(ProjectData.ProjectPath ));

        // Delete the project from the database
        await ProjectModel.deleteOne({
            _id: projectID,
            owner: User._id
        });

        res.json({
            success : true,
            message : "Project deleted successfully"
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Server error"
        });
    }
}

module.exports = { createProject, readProjectDetails, deleteProject };
