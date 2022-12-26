const mongoose = require("mongoose");

const usersSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    maxLength: 28,
  },
  passhash: {
    type: String,
    required: true,
  },
});

const Users = mongoose.model("users", usersSchema);

module.exports = Users;
