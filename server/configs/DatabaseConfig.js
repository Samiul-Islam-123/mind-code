//this function connects server with database
const mongoose = require("mongoose");

const Connect = async(URL) => {
    try{
        console.log("Connecting to Database...");
        await mongoose.connect(URL);
        console.log("Connected to Database successfully");
    }
    catch(error){
        throw error;
    }
}

module.exports = Connect;