var mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/blogApp");

const blogScheme = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  content: String,
  uploadedBy: String,
  uploadedAt: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model('Blog', blogScheme);