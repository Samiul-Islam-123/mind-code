const { ReadfileContents, SaveCurrentFile, CreateNewFile } = require("../controllers/EditorController");

const EditorRouter = require("express").Router();

EditorRouter.get('/:filePath/:clerkID', ReadfileContents);
EditorRouter.post('/save-file', SaveCurrentFile)
EditorRouter.post('/new-file', CreateNewFile)


module.exports = EditorRouter;