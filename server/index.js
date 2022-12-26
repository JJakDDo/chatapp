const express = require("express");
const helmet = require("helmet");
const { Server } = require("socket.io");
const app = express();

const server = require("http").createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: "true",
  },
});

app.use(helmet());
app.use(express.json());

app.get("/", (req, res) => {
  res.json("hi");
});

io.on("connect", (socket) => {});

server.listen(4000, () => {
  console.log("Server is listening on port 4000");
});
