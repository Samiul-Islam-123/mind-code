const fs = require("fs").promises;
const path = require("path");
const rimraf = require('rimraf');

const CreateDirectory = (DirName, projectDirectory) => {
    const dirPath = path.join(projectDirectory, DirName);
    return fs.mkdir(dirPath, { recursive: true })
        .then(() => {
            console.log("Directory created successfully:", dirPath);
        })
        .catch((error) => {
            console.error("Error creating directory:", error);
            throw error;
        });
};

const ReadAllDirectories = (projectDirectory) => {
    return fs.readdir(projectDirectory, { withFileTypes: true })
        .then((dirents) => {
            const directories = dirents.filter(dirent => dirent.isDirectory())
                .map(dirent => dirent.name);
            console.log("All directories:", directories);
            return directories;
        })
        .catch((error) => {
            console.error("Error reading directories:", error);
            return [];
        });
};

const ReadEverythingInDirectory = (dirPath) => {
    const results = [];
    return fs.readdir(dirPath)
        .then((files) => {
            const promises = files.map((file) => {
                const filePath = path.join(dirPath, file);
                return fs.stat(filePath).then((stat) => {
                    if (stat.isDirectory()) {
                        if (file !== 'node_modules') {
                            return ReadEverythingInDirectory(filePath).then((res) => {
                                results.push(...res);
                            });
                        }
                    } else {
                        results.push(filePath);
                    }
                });
            });
            return Promise.all(promises);
        })
        .then(() => results)
        .catch((error) => {
            console.error("Error reading directory contents:", error);
            return results;
        });
};

const DeleteDirectory = (dirPath) => {
    return new Promise((resolve, reject) => {
        rimraf(dirPath, (error) => {
            if (error) {
                console.error("Error deleting directory:", error);
                reject(error);
            } else {
                console.log("Directory deleted successfully:", dirPath);
                resolve(true);
            }
        });
    });
};

const RenameDirectory = (oldDirPath, newDirName) => {
    const newDirPath = path.join(path.dirname(oldDirPath), newDirName);
    return fs.rename(oldDirPath, newDirPath)
        .then(() => {
            console.log("Directory renamed successfully:", oldDirPath, "->", newDirPath);
        })
        .catch((error) => {
            console.error("Error renaming directory:", error);
            throw error;
        });
};

module.exports = {
    CreateDirectory,
    ReadAllDirectories,
    ReadEverythingInDirectory,
    DeleteDirectory,
    RenameDirectory
};
