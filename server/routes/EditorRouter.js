const { ReadfileContents, SaveCurrentFile, CreateNewFile, CreateNewFolder, DeleteController, RenameController } = require("../controllers/EditorController");

const EditorRouter = require("express").Router();
const fs = require('fs').promises;
const path = require('path');

EditorRouter.get('/:filePath/:clerkID', ReadfileContents);
EditorRouter.post('/save-file', SaveCurrentFile)
EditorRouter.post('/new-file', CreateNewFile)
EditorRouter.post('/new-folder', CreateNewFolder);
// Route to delete a folder
EditorRouter.post('/delete-folder', async (req, res) => {
    const { folderPath } = req.body;

    try {
        // Verify folderPath is provided and is a string
        if (!folderPath || typeof folderPath !== 'string') {
            return res.status(400).json({ error: 'Invalid folder path' });
        }

        // Construct absolute path
        const absolutePath = folderPath

        // Check if the path exists
        const pathExists = await fs.access(absolutePath)
            .then(() => true)
            .catch(() => false);

        if (!pathExists) {
            return res.status(404).json({ error: 'Folder not found' });
        }

        // Delete folder recursively
        await fs.rmdir(absolutePath, { recursive: true });

        res.json({ message: 'Folder deleted successfully' });
    } catch (error) {
        console.error('Error deleting folder:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to delete a file
EditorRouter.post('/delete-file', async (req, res) => {
    const { filePath } = req.body;
    console.log(filePath)

    try {
        // Verify filePath is provided and is a string
        if (!filePath) {
            return res.status(400).json({ error: 'Invalid file path' });
        }

        // Construct absolute path
        const absolutePath = filePath

        // Check if the file exists
        const fileExists = await fs.access(absolutePath)
            .then(() => true)
            .catch(() => false);

        if (!fileExists) {
            return res.status(404).json({ error: 'File not found' });
        }

        // Delete the file
        await fs.unlink(absolutePath);

        res.json({ message: 'File deleted successfully' });
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

EditorRouter.post('/rename', RenameController);




module.exports = EditorRouter;