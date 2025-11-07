const noodemon = require("nodemon");
const express = require("express");
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/admin-dashboard")
  .then((res) => console.log("connected sucessfuly ✅"))
  .catch((res) => console.log(res));

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  read_time: { type: String },
  tags: {
    type: String,
    enum: ["Technology", "Design", "Education"],
    default: "Technology",
  },
  created_at: { type: Date, default: Date.now() },
});
