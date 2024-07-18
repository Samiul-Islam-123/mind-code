const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const { spawn } = require("child_process");
const dotenv = require("dotenv");
const Connect = require("./configs/DatabaseConfig"); // Adjust as per your database configuration
const UserRouter = require("./routes/UserRouter"); // Adjust as per your route configurations
const ProjectRouter = require("./routes/ProjectRouter");
const EditorRouter = require("./routes/EditorRouter");
const { startProject } = require("./services/CommandExecutor");

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

const clientPaths = new Map(); // Track current path for each client

io.on("connection", (socket) => {
  console.log("A user connected: " + socket.id);

  socket.emit("connected", "Connected to Socket Server");

  socket.on("setPath", async (path) => {
    try {
      clientPaths.set(socket.id, path);
      socket.emit("set-path", path);
      socket.emit("command-out", `Directory changed to ${path}`);
    } catch (error) {
      socket.emit("command-out", `Error: ${error.message}`);
    }
  });

  socket.on("command", async (data) => {
    try {
      const currentPath = clientPaths.get(socket.id) || ".";
      if (data.command.startsWith("cd ")) {
        const newPath = data.command.substring(3).trim();
        clientPaths.set(socket.id, newPath);
        socket.emit("set-path", newPath);
        socket.emit("command-out", `Directory changed to ${newPath}`);
      } else {
        const commandProcess = runCommand(data.command, currentPath);

        commandProcess.stdout.on('data', (data) => {
          socket.emit("command-out", data.toString());
        });

        commandProcess.stderr.on('data', (data) => {
          socket.emit("command-out", data.toString());
        });

        commandProcess.on('close', (code) => {
          socket.emit("command-out", `Process exited with code ${code}`);
        });
      }
    } catch (error) {
      socket.emit("command-out", `Error: ${error.message}`);
    }
  });

  socket.on("run-project", async(templateName) => {
    try{
      await startProject(templateName);
      socket.emit("run-project-output", "Project started...")
    }
    catch(error){

    }
  })

  socket.on("disconnect", () => {
    console.log("User disconnected: " + socket.id);
    clientPaths.delete(socket.id);
  });
});

const runCommand = (cmd, cwd) => {
  const shell = '/bin/sh';
  const shellFlag = '-c';

  return spawn(shell, [shellFlag, cmd], { cwd });
};

server.listen(PORT, async () => {
  console.log("Server is starting...");
  await Connect(`mongodb+srv://isamiul099:1zYNcTUjB9HfB34R@cluster0.9whcd58.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`); // Connect to MongoDB or your database
  console.log("Server is up and running on PORT: " + PORT);
});
