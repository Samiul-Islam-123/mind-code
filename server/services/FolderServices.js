const fs = require("fs").promises;
const path = require("path");

const CreateFile = async (fileName, fileContent, directoryPath) => {
    const filePath = path.join(directoryPath, fileName);

    try {
        await fs.writeFile(filePath, fileContent);
        console.log("File created successfully:", filePath);
        return true;
    } catch (error) {
        console.error("Error creating file:", error);
        return false;
    }
};

const ReadAllFiles = async (directoryPath) => {
    try {
        const dirents = await fs.readdir(directoryPath, { withFileTypes: true });
        const files = dirents
            .filter(dirent => dirent.isFile())
            .map(dirent => dirent.name);

        console.log("All files:", files);
        return files;
    } catch (error) {
        console.error("Error reading files:", error);
        return [];
    }
};

const ReadSpecificFile = async (filePath) => {
    try {
        const fileContents = await fs.readFile(filePath, 'utf8');
        return fileContents;
    } catch (error) {
        console.error('Error reading file:', error);
        return false;
    }
};

const DeleteFileOrFolder = async (filePath) => {
    try {
        await fs.rm(filePath, { recursive: true, force: true });
        console.log("File or folder deleted successfully:", filePath);
        return true;
    } catch (error) {
        console.error("Error deleting file or folder:", error);
        return false;
    }
};

const RenameFileOrFolder = async (oldPath, newName) => {
    const newPath = path.join(path.dirname(oldPath), newName);

    try {
        await fs.rename(oldPath, newPath);
        console.log("File or folder renamed successfully:", oldPath, "->", newPath);
        return true;
    } catch (error) {
        console.error("Error renaming file or folder:", error);
        return false;
    }
};

const SaveFileContents = async (filePath, fileContent) => {
    try {
        await fs.writeFile(filePath, fileContent);
        console.log("File saved successfully:", filePath);
        return true;
    } catch (error) {
        console.error("Error saving file:", error);
        return false;
    }
};

const CreateNewFolder = async (directoryPath, folderName) => {
    const folderPath = path.join(directoryPath, folderName);

    try {
        await fs.mkdir(folderPath, { recursive: true });
        console.log("Folder created successfully:", folderPath);
        return true;
    } catch (error) {
        console.error("Error creating folder:", error);
        return false;
    }
};

module.exports = {
    CreateFile,
    ReadAllFiles,
    ReadSpecificFile,
    DeleteFileOrFolder,
    RenameFileOrFolder,
    SaveFileContents,
    CreateNewFolder
};
