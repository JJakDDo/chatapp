const express = require("express");
const helmet = require("helmet");
const { Server } = require("socket.io");
const cors = require("cors");

const authRouter = require("./routers/authRouter");
const app = express();

const server = require("http").createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5173",
    credentials: true,
  },
});

app.use(helmet());
app.use(
  cors({
    origin: "http://127.0.0.1:5173",
    credentials: true,
  })
);
app.use(express.json());

app.use("/auth", authRouter);

io.on("connect", (socket) => {});

server.listen(4000, () => {
  console.log("Server is listening on port 4000");
});
