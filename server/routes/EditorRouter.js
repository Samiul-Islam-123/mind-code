const { 
    ReadfileContents, 
    SaveCurrentFile, 
    CreateNewFile, 
    DeleteFileOrFolderController, 
    RenameFileOrFolderController, 
    CreateNewFolderController 
} = require("../controllers/EditorController");

const EditorRouter = require("express").Router();

EditorRouter.get('/:filePath/:clerkID', ReadfileContents);
EditorRouter.post('/save-file', SaveCurrentFile);
EditorRouter.post('/new-file', CreateNewFile);
EditorRouter.post('/delete', DeleteFileOrFolderController);
EditorRouter.post('/rename', RenameFileOrFolderController);
EditorRouter.post('/new-folder', CreateNewFolderController);

module.exports = EditorRouter;
