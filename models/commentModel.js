const mongoose = require("mongoose");
const Blog = require("./blogModel");
const User = require("./userModel");

const commentSchema = new mongoose.Schema(
    {
        comment: {
            type: String,
            required: [true, "A comment is mandatory"],
        },
        createdAt: {
            type: Date,
            default: Date.now(),
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: [true, "A comment must belong to user"],
        },
        blog: {
            type: mongoose.Schema.ObjectId,
            ref: "Blog",
            required: [true, "A comment must belong to a blog."],
        },
    },
    {
        toJSON: { virtual: true },
        toObject: { virtual: true },
    }
);

commentSchema.pre(/^find/, function (next) {
    this.populate({
        path: "user",
        fields: "name photo",
    });
    this.populate({
        path: "blog",
        fields: "title",
    });
    next();
});
commentSchema.statics.calcTotalComments = async function (blogId) {
    const states = await this.aggregate([
        {
            $match: { blog: blogId },
        },
        {
            $group: {
                _id: "$blog",
                nComments: { $sum: 1 },
            },
        },
    ]);
    await Blog.findByIdAndUpdate(blogId, {
        commentsQuantity: states[0].nComments,
    });
};
// commentSchema.post("save", function () {
//     this.constructor.calcTotalComments(this.blog);
// });

const Comment = new mongoose.model("Comment", commentSchema);

module.exports = Comment;
