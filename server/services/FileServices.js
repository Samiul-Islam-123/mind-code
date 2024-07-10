const fs = require("fs");
const path = require("path");

const CreateFile = (fileName, fileContent, directoryPath) => {
    const filePath = path.join(directoryPath, fileName);

    fs.writeFileSync(filePath, fileContent, (error) => {
        if (error) {
            console.error("Error creating file:", error);
            return error;
        } else {
            console.log("File created successfully:", filePath);
        }
    });
};

const ReadAllFiles = (directoryPath) => {
    try {
        const files = fs.readdirSync(directoryPath, { withFileTypes: true })
            .filter(dirent => dirent.isFile())
            .map(dirent => dirent.name);

        console.log("All files:", files);
        return files;
    } catch (error) {
        console.error("Error reading files:", error);
        return [];
    }
};

const DeleteFile = (filePath) => {
    try {
        fs.unlinkSync(filePath);
        console.log("File deleted successfully:", filePath);
        return true;
    } catch (error) {
        console.error("Error deleting file:", error);
        return false;
    }
};

const RenameFile = (oldFilePath, newFileName) => {
    const newFilePath = path.join(path.dirname(oldFilePath), newFileName);

    try {
        fs.renameSync(oldFilePath, newFilePath);
        console.log("File renamed successfully:", oldFilePath, "->", newFilePath);
        return true;
    } catch (error) {
        console.error("Error renaming file:", error);
        return false;
    }
};

const SaveFileContents = (filePath, fileContent) => {
    try {
        fs.writeFileSync(filePath, fileContent);
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
    SaveFileContents
};
