const { createProject, readProjectDetails, deleteProject } = require('../controllers/ProjectController');

const ProjectRouter = require('express').Router();

ProjectRouter.post('/', createProject);
ProjectRouter.get("/:projectID/:clerkID", readProjectDetails)
ProjectRouter.delete("/:projectID/:clerkID", deleteProject)

module.exports = ProjectRouter;