const { ReadfileContents, SaveCurrentFile, CreateNewFile, CreateNewFolderController, DeleteFileOrFolderController, RenameFileOrFolderController } = require("../controllers/EditorController");

const EditorRouter = require("express").Router();

EditorRouter.get('/:filePath/:clerkID', ReadfileContents);
EditorRouter.post('/save-file', SaveCurrentFile)
EditorRouter.post('/new-file', CreateNewFile)
EditorRouter.post('/new-folder', CreateNewFolderController),
EditorRouter.delete('/delete', DeleteFileOrFolderController);
EditorRouter.put('/rename', RenameFileOrFolderController)


module.exports = EditorRouter;