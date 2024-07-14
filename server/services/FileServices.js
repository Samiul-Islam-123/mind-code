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

const DeleteFile = async (filePath) => {
    try {
        await fs.unlink(filePath);
        console.log("File deleted successfully:", filePath);
        return true;
    } catch (error) {
        console.error("Error deleting file:", error);
        return false;
    }
};

const RenameFile = async (oldFilePath, newFileName) => {
    const newFilePath = path.join(path.dirname(oldFilePath), newFileName);

    try {
        await fs.rename(oldFilePath, newFilePath);
        console.log("File renamed successfully:", oldFilePath, "->", newFilePath);
        return true;
    } catch (error) {
        console.error("Error renaming file:", error);
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

module.exports = {
    CreateFile,
    ReadAllFiles,
    DeleteFile,
    RenameFile,
    SaveFileContents,
    ReadSpecificFile
};
