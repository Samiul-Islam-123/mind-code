const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username : String,
    email : String,
    profilePictureURL : String,
    updatedAt : {
        type : Date,
        default : Date.now()
    },
    clerkID : {
        type : String,
        required : true
    }
})

const UserModel = new mongoose.model("users", UserSchema );

module.exports = UserModel;