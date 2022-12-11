const mongoose = require("mongoose");
const User = require("./userModel");
const Comment = require("./commentModel");
const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Blog title is required"],
        },
        subTitle: {
            type: String,
        },
        description: {
            type: String,
            required: [true, "Please do mention your blog."],
            min: 100,
        },
        commentsQuantity: {
            type: Number,
            default: 0,
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
        },
        createdAt: {
            type: Date,
            default: Date.now(),
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

blogSchema.index({ createdAt: 1 });

//In order to avoid child referencing on Comment, virtual populate is used
blogSchema.virtual("comments", {
    ref: "Comment",
    foreignField: "blog",
    localField: "_id",
});

blogSchema.pre(/^find/, function (next) {
    this.populate({
        path: "user",
        fields: "name photo",
    });
    next();
});

const Blog = new mongoose.model("Blog", blogSchema);

module.exports = Blog;
