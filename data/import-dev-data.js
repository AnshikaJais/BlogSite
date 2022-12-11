/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const Comment = require("../models/commentModel");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
    "<PASSWORD>",
    process.env.DATABASE_PASSWORD
).replace("<DATABASE_NAME>", process.env.DATABASE_NAME);

mongoose
    .connect(DB, {
        useNewUrlParser: true,
    })
    .then(() => console.log("DB connection successful!"));

// READ JSON FILE
const blogs = JSON.parse(fs.readFileSync(`${__dirname}/blogs.json`, "utf-8"));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));
const comments = JSON.parse(
    fs.readFileSync(`${__dirname}/comments.json`, "utf-8")
);

// IMPORT DATA INTO DB
const importData = async () => {
    try {
        await Blog.create(blogs);
        await User.create(users, { validateBeforeSave: false });
        await Comment.create(comments);
        console.log("Data successfully loaded!");
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
    try {
        await Blog.deleteMany();
        await User.deleteMany();
        await Comment.deleteMany();
        console.log("Data successfully deleted!");
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

if (process.argv[2] === "--import") {
    importData();
} else if (process.argv[2] === "--delete") {
    deleteData();
}
