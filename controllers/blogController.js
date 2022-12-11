const AppError = require("../utilities/appError");
const Blog = require("../models/blogModel");
const catchAsync = require("../utilities/catchAsync");

exports.getAllBlogs = catchAsync(async (req, res, next) => {
    const blogs = await Blog.find();
    res.status(200).json({
        status: "success",
        result: blogs.length,
        data: {
            date: blogs,
        },
    });
});

exports.getBlog = catchAsync(async (req, res, next) => {
    const blog = await Blog.findOne({ id: req.params.id });
    if (!blog)
        return next(
            new AppError(`Blog with Id: ${req.params.id} is not available`, 400)
        );
    res.status(200).json({
        status: "success",
        data: {
            data: blog,
        },
    });
});

exports.createBlog = catchAsync(async (req, res, next) => {
    console.log(req.body);
    const newBlog = await Blog.create(req.body);
    res.status(200).json({
        status: "success",
        data: {
            data: newBlog,
        },
    });
});

exports.updateBlog = catchAsync(async (req, res, next) => {
    console.log(req.body);
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!updatedBlog)
        return next(
            new AppError(
                `Blog with Id: ${req.params.id} is not available.`,
                400
            )
        );
    res.status(200).json({
        status: "success",
        data: {
            data: updatedBlog,
        },
    });
});

exports.deleteBlog = catchAsync(async (req, res, next) => {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog)
        return next(
            new AppError(
                `Blog with id: ${req.params.id} is not available.`,
                400
            )
        );
    res.status(204).json({
        status: "success",
        data: {
            data: deletedBlog,
        },
    });
});
