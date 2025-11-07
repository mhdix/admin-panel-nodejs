require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const express = require("express");

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

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, require: true },
});

const User = mongoose.model("User", userSchema);

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({
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

app.post("/api/users", async (req, res) => {
  try {
    const { name, email } = req.body;

    const addUser = await User({ name, email });
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

// ------------------------------------- BLOG -----------------------------------------

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
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

app.post("/api/blogs", async (req, res) => {
  try {
    const { image, tags, readTime, title, description } = req.body;

    const addBlog = new Blog({
      image,
      tags,
      readTime,
      title,
      description,
    });
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

app.listen(process.env.PORT, () => console.log("server connected"));
