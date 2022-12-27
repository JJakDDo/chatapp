require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const { Server } = require("socket.io");
const cors = require("cors");
const session = require("express-session");
const mongoose = require("mongoose");
const redisClient = require("./redis");
const RedisStore = require("connect-redis")(session);

const authRouter = require("./routers/authRouter");
const app = express();

const server = require("http").createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    credentials: true,
    name: "sid",
    store: new RedisStore({
      client: redisClient,
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      //   secure: "false",
      //   sameSite: "lax",
      secure: process.env.NODE_ENV === "production" ? "true" : "auto",
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      expires: 1000 * 60 * 60 * 24,
    },
  })
);

app.use("/auth", authRouter);

io.on("connect", (socket) => {});

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";

mongoose
  .connect(MONGODB_URI)
  .then(() =>
    server.listen(4000, () => {
      console.log("Server is listening on port 4000");
    })
  )
  .catch((err) => console.error(err.message));
