const redisClient = require("../redis");

module.exports.authorizeUser = (socket, next) => {
  if (!socket.request.session || !socket.request.session.user) {
    next(new Error('Not authorized"'));
  }
  next();
};

module.exports.initializeUser = async (socket) => {
  socket.user = { ...socket.request.session.user };
  await redisClient.hset(
    `userId:${socket.user.username}`,
    "userId",
    socket.user.userId
  );
  const friendList = await redisClient.lrange(
    `friends:${socket.user.username}`,
    0,
    -1
  );

  socket.emit("friends", friendList);
  console.log(socket.user.userId);
  console.log(socket.request.session.user.username);
};

module.exports.addFriend = async (socket, friendName, cb) => {
  if (friendName === socket.user.username)
    return cb({ done: false, errorMessage: "Cannot add self!" });

  const friendUserId = await redisClient.hget(`userId:${friendName}`, "userId");
  const currentFriendList = await redisClient.lrange(
    `friends:${socket.user.username}`,
    0,
    -1
  );

  if (!friendUserId)
    return cb({ done: false, errorMessage: "User does not exist!" });
  if (currentFriendList && currentFriendList.indexOf(friendName) !== -1)
    return cb({ done: false, errorMessage: "Friend already added!" });

  await redisClient.lpush(`friends:${socket.user.username}`, friendName);
  cb({ done: true });
};
