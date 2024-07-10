const UserModel = require("../models/UserModel");
const path = require('path');
const CreateDirectory = require("../services/FolderServices");
const ProjectModel = require("../models/ProjectModel");

const rootDirectory = path.resolve(__dirname, '../../');
const projectDirectory = path.join(rootDirectory,'Projects');


const CreateUser = async (req, res) => {
    try {
        const { username, email, profilePictureURL, clerkID } = req.body;
        
        if (!username || !email || !profilePictureURL || !clerkID)
            return res.json({
        success: false,
        message: "Invalid data"
    });
    
    const currentUser = new UserModel({
        username: username,
        email: email,
        profilePictureURL: profilePictureURL,
        clerkID: clerkID
    });
    
    await currentUser.save();

    //create new directory in project
    CreateDirectory(currentUser._id.toString(),projectDirectory);
    
    res.json({
        success: true,
        message: "User created successfully"
    });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

const ReadEveryUser = async (req, res) => {
    try {
        const allUsers = await UserModel.find();
        if (allUsers.length === 0)
            return res.json({
        success: true,
        message: "No users found"
    });
    
    res.json({
        success: true,
        allUsers: allUsers,
        message: "Users found"
    });
} catch (error) {
    console.log(error);
    return res.status(500).json({
        success: false,
        message: "Server error"
    });
}
};

const ReadSpecificUser = async (req, res) => {
    try {
        let query = {};
        const { clerkID, email } = req.params;
        
        if (clerkID && email) {
            query = {
                $or: [
                    { clerkID: { $regex: new RegExp(clerkID, 'i') } },
                    { email: { $regex: new RegExp(email, 'i') } }
                ]
            };
        } else if (clerkID) {
            query = { clerkID: { $regex: new RegExp(clerkID, 'i') } };
        } else if (email) {
            query = { email: { $regex: new RegExp(email, 'i') } };
        } else {
            return res.json({
                success: false,
                message: "Invalid request. Provide clerkID or email."
            });
        }

        const userData = await UserModel.findOne(query);

        if (!userData) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        const ProjectData = await ProjectModel.find({
            owner : userData._id
        })

        res.json({
            success: true,
            userData: userData,
            ProjectData : ProjectData,
            message: "User found",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};



const UpdateUser = async (req, res) => {
    try {
        const { clerkID, newUsername, newEmail, newProfilePictureURL } = req.body;

        const userToUpdate = await UserModel.findOne({ clerkID: clerkID });

        if (!userToUpdate) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        if (newUsername) {
            userToUpdate.username = newUsername;
        }
        if (newEmail) {
            userToUpdate.email = newEmail;
        }
        if (newProfilePictureURL) {
            userToUpdate.profilePictureURL = newProfilePictureURL;
        }

        await userToUpdate.save();

        res.json({
            success: true,
            message: "User updated successfully"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

const DeleteUser = async (req, res) => {
    try {
        const clerkID = req.params.clerkID;

        const userToDelete = await UserModel.findOneAndDelete({ clerkID: clerkID });

        if (!userToDelete) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

module.exports = {
    CreateUser,
    ReadEveryUser,
    ReadSpecificUser,
    UpdateUser,
    DeleteUser
};
