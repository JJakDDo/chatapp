require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");

const authRouter = require("./routers/authRouter");
const {
  sessionMiddleware,
  wrap,
  corsConfig,
} = require("./controllers/serverController");
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

io.use(wrap(sessionMiddleware));
io.on("connect", (socket) => {
  console.log(socket.request.session.user.username);
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
