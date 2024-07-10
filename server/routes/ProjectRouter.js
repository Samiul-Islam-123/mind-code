const { createProject } = require('../controllers/ProjectController');

const ProjectRouter = require('express').Router();

ProjectRouter.post('/', createProject);

module.exports = ProjectRouter;