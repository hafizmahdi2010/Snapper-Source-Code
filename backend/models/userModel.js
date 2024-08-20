var mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/blogApp");

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  email: String,
  password: String,
  date: {
    type: Date,
    default: Date.now
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isBlocked: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("User", userSchema);