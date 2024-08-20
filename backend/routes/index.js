var express = require('express');
var router = express.Router();
var userModel = require("../models/userModel");
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const multer = require('multer');
var blogModel = require("../models/blogModel");
var path = require("path")
var fs = require("fs");

const secret = "secret";

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/signUp", async (req, res) => {
  let { username, name, email, password } = req.body;
  let user = await userModel.findOne({ email: email });
  if (user) {
    return res.json({ success: false, msg: "Email already exists" })
  }
  else {

    let newUser;

    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, async function (err, hash) {
        newUser = await userModel.create({
          username: username,
          name: name,
          email: email,
          password: hash
        });
      });
    });

    return res.json({ success: true, msg: "User created successfully" })
  }
});

router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  let user = await userModel.findOne({ email: email });
  if (user) {
    bcrypt.compare(password, user.password, function (err, result) {
      if (err) throw err;
      else {
        if (result) {
          var token = jwt.sign({ email: user.email, userId: user._id }, secret);
          return res.json({ success: true, msg: "User logged in successfully", token: token, userId: user._id })
        }
        else {
          return res.json({ success: false, msg: "Password is incorrect" })
        }
      }
    })
  }
  else {
    return res.json({ success: false, msg: "User not found" })
  }
});

// Define storage options
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the upload directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Define the filename format
  }
});

const upload = multer({ storage: storage })

router.post("/createBlog", upload.single('image'), async (req, res) => {
  console.log(req.file); // Check if the file is uploaded
  console.log(req.body); // Check the other form data

  if (!req.file) {
    return res.json({ success: false, msg: "No file uploaded" });
  }

  let { title, desc, content } = req.body;
  let user = await userModel.findById(req.body.userId);

  if (user) {

    // Extract only the filename using path.basename
    let imageName = path.basename(req.file.path);

    let blog = await blogModel.create({
      title: title,
      description: desc,
      content: content,
      image: imageName,
      uploadedBy: req.body.userId,
    });

    return res.json({ success: true, msg: "Blog created successfully" });
  } else {
    return res.json({ success: false, msg: "User not found" });
  }
});

router.get("/getBlogs", async (req, res) => {
  try {
    let blogs = await blogModel.find();

    let fullBlogData = await Promise.all(
      blogs.map(async (blog) => {
        let user = await userModel.findById(blog.uploadedBy);
        return {
          _id: blog._id,
          title: blog.title,
          desc: blog.description,
          content: blog.content,
          image: `http://localhost:3000/uploads/${blog.image}`,
          uploadedBy: user ? user.name : "Unknown", // Handle the case where the user is not found
          uploadedAt: blog.uploadedAt,
        };
      })
    );

    return res.json(fullBlogData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
});

router.post("/getBlog", async (req, res) => {
  let user = await userModel.findById(req.body.userId);
  let fullData = [];
  if (user) {
    let blog = await blogModel.findById(req.body.blogId);
    if (blog) {
      fullData.push({
        _id: blog._id,
        title: blog.title,
        content: blog.content,
        image: `http://localhost:3000/uploads/${blog.image}`,
        uploadedBy: user.name,
        date: blog.uploadedAt,
        desc: blog.description,
        userId: blog.uploadedBy
      })
      return res.json({ success: true, blog: fullData })
    }
    else {
      return res.json({ success: false, msg: "Blog not found" })
    }
  }
  else {
    return res.json({ success: false, msg: "User not found" })
  }
});

router.post("/deleteBlog", async (req, res) => {
  let { userId, blogId } = req.body;

  try {
    let user = await userModel.findById(userId);

    if (user) {
      let blog = await blogModel.findById(blogId);

      if (blog) {
        let filePath = path.join(__dirname, "../uploads", blog.image);

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        } else {
          console.log("File not found");
        }

        await blogModel.findByIdAndDelete(blogId); // Delete the blog after handling the file
        return res.json({ success: true, msg: "Blog deleted successfully" });
      } else {
        return res.json({ success: false, msg: "Blog not found" });
      }
    } else {
      return res.json({ success: false, msg: "User not found" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
});

router.post("/editBlog", upload.single('image'), async (req, res) => {
  let { userId, blogId, title, desc, content } = req.body;

  try {
    let user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, msg: "User not found" });
    }

    let blog = await blogModel.findById(blogId);

    if (!blog) {
      return res.json({ success: false, msg: "Blog not found" });
    }

    if (!req.file) {
      return res.json({ success: false, msg: "No file uploaded" });
    }

    // Extract only the filename
    let imageName = path.basename(req.file.path);

    // Delete the old image if it exists
    if (blog.image) {
      let filePath = path.join(__dirname, "../uploads", blog.image);
      
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.error('Error deleting the old image:', err);
          return res.status(500).json({ success: false, msg: "Error deleting old image" });
        }
      }
    }

    // Update the blog with new data
    blog.title = title;
    blog.description = desc;
    blog.content = content;
    blog.image = imageName;

    await blog.save();

    return res.json({ success: true, msg: "Blog updated successfully", blog });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
});

router.post("/getUser", async (req, res) => {
  let user = await userModel.findById(req.body.userId);
  if (user) {
    return res.json({ success: true, user })
  }
  else {
    return res.json({ success: false, msg: "User not found" })
  }
})

module.exports = router;
