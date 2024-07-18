const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
    Projectname : String,
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "users"
    },
    updatedAt : {
        type : Date,
        default : Date.now()
    },
    ProjectPath : {
        type : String,
        required : true
    },
    TemplateName : String,
    description : String
})

const ProjectModel = new mongoose.model("Projects", ProjectSchema );

module.exports = ProjectModel;