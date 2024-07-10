const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const Connect = require("./configs/DatabaseConfig");
const UserRouter = require("./routes/UserRouter");
const ProjectRouter = require("./routes/ProjectRouter");



const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

const PORT = process.env.PORT || 5500;

app.get("/", (req,res) => {
    res.json({
        success : true,
        message : "Server is up and running perfectly"
    })
})

app.use("/user", UserRouter);
app.use('/project', ProjectRouter)

app.listen(PORT,async() => {
    console.log("Server is starting...");
    await Connect(process.env.MONGO_DB_URL);
    console.log("Server is up and running on PORT : "+PORT);
});