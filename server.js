require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const express = require("express");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

mongoose
  .connect("mongodb://127.0.0.1:27017/blogdb")
  .then((res) => console.log("db connected" + process.env.DB_URL))
  .catch((res) => console.log(caches));

// ----------------- Multer -----------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// -------------------- USER ------------------------
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, require: true },
  image: { type: String },
});

const User = mongoose.model("User", userSchema);

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      data: users,
      message: "user fetched sucessfuly ✅",
    });
  } catch (error) {
    res.status(500).json({
      data: null,
      message: "user cant fetch" + error,
    });
  }
});

app.post("/api/users", upload.single("image"), async (req, res) => {
  try {
    const { name, email } = req.body;
    const file = req.file;
    const addUser = await User({
      name,
      email,
      image: file ? `/uploads/${file.filename}` : "",
    });
    addUser.save();
    res.status(200).json({
      data: addUser,
      message: "post user sucessfuly ✅",
    });
  } catch (error) {
    res.status(500).json({
      data: null,
      message: "user cant added" + error,
    });
  }
});

// -------------------- BLOG ------------------------
const blogSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  image: String,
  readTime: { type: Number, default: 1 },
  tags: {
    type: [String],
    enum: ["Technology", "Design", "Learn"],
    default: "Learn",
  },
  viewCount: { type: Number, default: 1 },
});
const Blog = mongoose.model("Blog", blogSchema);

app.get("/api/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json({
      data: blogs,
      message: "get blog secessfuly ✅",
    });
  } catch (error) {
    res.status(500).json({
      data: null,
      message: "undefind blog",
    });
  }
});

app.post("/api/blogs", upload.single("image"), async (req, res) => {
  try {
    console.log("req.file ----- ", req.file);

    const { image, tags, readTime, title, blog, description } = req.body;
    const file = req.file;
    console.log("file", file);
    const addBlog = new Blog({
      image,
      tags,
      readTime,
      title,
      description,
      image: file ? `/uploads/${file.filename}` : "",
    });
    console.log("addBlog -----", addBlog);
    await addBlog.save();

    res.json({
      data: addBlog,
      message: "blog fetched sucessfuly ✅",
    });
  } catch (error) {
    res.status(500).json({
      data: null,
      message: "undefind blog",
    });
  }
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.listen(process.env.PORT, () => console.log("server connected"));
