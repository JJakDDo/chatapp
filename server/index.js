require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");

const authRouter = require("./routers/authRouter");
const notiRouter = require("./routers/notiRouter");
const {
  sessionMiddleware,
  wrap,
  corsConfig,
} = require("./controllers/serverController");
const {
  authorizeUser,
  initializeUser,
  addFriend,
  onDisconnect,
  dm,
} = require("./controllers/socketController");
const Redis = require("ioredis");
const app = express();

const server = require("http").createServer(app);
const io = new Server(server, {
  cors: corsConfig,
});

app.use(helmet());
app.use(cors(corsConfig));
app.use(express.json());
app.use(sessionMiddleware);

app.use("/auth", authRouter);
app.use("/notification", notiRouter);

io.use(wrap(sessionMiddleware));
io.use(authorizeUser);

const subscriber = new Redis();

subscriber.subscribe("chatapp:notification");

subscriber.on("message", (channel, message) => {
  console.log(message);
  if (channel === "chatapp:notification") io.emit("notification", message);
});

io.on("connect", (socket) => {
  initializeUser(socket);

  socket.on("add_friend", (friendName, cb) =>
    addFriend(socket, friendName, cb)
  );

  socket.on("dm", (message) => dm(socket, message));

  socket.on("disconnecting", () => onDisconnect(socket));
});

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";

mongoose
  .connect(MONGODB_URI)
  .then(() =>
    server.listen(4000, () => {
      console.log("Server is listening on port 4000");
    })
  )
  .catch((err) => console.error(err.message));
