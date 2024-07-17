const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const { exec } = require("child_process");
const dotenv = require("dotenv");
const Connect = require("./configs/DatabaseConfig"); // Adjust as per your database configuration
const UserRouter = require("./routes/UserRouter"); // Adjust as per your route configurations
const ProjectRouter = require("./routes/ProjectRouter");
const EditorRouter = require("./routes/EditorRouter");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust this as needed for your setup
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(cors());
dotenv.config();

const PORT = process.env.PORT || 5500;

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Server is up and running perfectly",
  });
});

app.use("/user", UserRouter);
app.use("/project", ProjectRouter);
app.use("/editor", EditorRouter);

io.on("connection", (socket) => {
  console.log("A user connected: " + socket.id);

  socket.emit("connected", "Connected to Socket Server");

  socket.on("setPath", async (path) => {
    try {
      await setPath(path);
      const currentPath = await getCurrentPath();
      socket.emit("command-out", `Directory changed to ${currentPath}`);
    } catch (error) {
      socket.emit("command-out", `Error: ${error.message}`);
    }
  });

  socket.on("command", async (data) => {
    try {
      const output = await runCommand(data.command, data.path);
      console.log(output)
      socket.emit("command-out", output);
    } catch (error) {
      socket.emit("command-out", `Error: ${error.message}`);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: " + socket.id);
  });
});

// Function to execute a command
const runCommand = (cmd, path = ".") => {
  return new Promise((resolve, reject) => {
    exec(cmd, { cwd: path }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr));
      } else {
        resolve(stdout);
      }
    });
  });
};

// Function to change directory
const setPath = (path) => {
    console.log(path)
  return new Promise((resolve, reject) => {
    exec(`cd ${path}`, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`Failed to change directory to ${path}: ${stderr}`));
      } else {
        resolve(`Directory changed to ${path}`);
      }
    });
  });
};

// Function to get current directory path
const getCurrentPath = () => {
  return new Promise((resolve, reject) => {
    exec("pwd", (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr));
      } else {
        resolve(stdout.trim());
      }
    });
  });
};

server.listen(PORT, async () => {
  console.log("Server is starting...");
  await Connect(`mongodb+srv://isamiul099:1zYNcTUjB9HfB34R@cluster0.9whcd58.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`); // Connect to MongoDB or your database
  console.log("Server is up and running on PORT: " + PORT);
});
