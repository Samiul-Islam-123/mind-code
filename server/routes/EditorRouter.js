const { ReadfileContents, SaveCurrentFile, CreateNewFile, CreateNewFolder } = require("../controllers/EditorController");

const EditorRouter = require("express").Router();

EditorRouter.get('/:filePath/:clerkID', ReadfileContents);
EditorRouter.post('/save-file', SaveCurrentFile)
EditorRouter.post('/new-file', CreateNewFile)
EditorRouter.post('/new-folder', CreateNewFolder);



module.exports = EditorRouter;