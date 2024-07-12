const fs = require("fs");
const path = require("path");
const rimraf = require('rimraf');


const CreateDirectory = (DirName, projectDirectory) => {
    const dirPath = path.join(projectDirectory, DirName);

    fs.mkdir(dirPath, { recursive: true }, (error) => {
        if (error) {
            console.error("Error creating directory:", error);
            // Handle the error appropriately, such as logging or returning it
            return error;
        } else {
            console.log("Directory created successfully:", dirPath);
        }
    });
};

const ReadAllDirectories = (projectDirectory) => {
    try {
        const directories = fs.readdirSync(projectDirectory, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        console.log("All directories:", directories);
        return directories;
    } catch (error) {
        console.error("Error reading directories:", error);
        return [];
    }
};

const ReadEverythingInDirectory = (dirPath) => {
    let results = [];
    try {
        const files = fs.readdirSync(dirPath);
        files.forEach((file) => {
            const filePath = path.join(dirPath, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                // Ignore directories named node_modules
                if (file !== 'node_modules') {
                    results = results.concat(ReadEverythingInDirectory(filePath));
                }
            } else {
                results.push(filePath);
            }
        });
    } catch (error) {
        console.error("Error reading directory contents:", error);
    }
    return results;
};


const DeleteDirectory = (dirPath) => {
    try {
        rimraf.sync(dirPath);
        console.log("Directory deleted successfully:", dirPath);
        return true;
    } catch (error) {
        console.error("Error deleting directory:", error);
        return false;
    }
};

const RenameDirectory = (oldDirPath, newDirName) => {
    const newDirPath = path.join(path.dirname(oldDirPath), newDirName);

    try {
        fs.renameSync(oldDirPath, newDirPath);
        console.log("Directory renamed successfully:", oldDirPath, "->", newDirPath);
        return true;
    } catch (error) {
        console.error("Error renaming directory:", error);
        return false;
    }
};

module.exports = {
    CreateDirectory,
    ReadAllDirectories,
    ReadEverythingInDirectory,
    DeleteDirectory,
    RenameDirectory
};
