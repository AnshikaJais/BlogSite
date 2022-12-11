const Comment = require("../models/commentModel");
const catchAsync = require("../utilities/catchAsync");
const AppError = require("../utilities/appError");

exports.getAllComents = catchAsync(async (req, res, next) => {
    const comments = await Comment.find();
    res.status(200).json({
        status: "success",
        result: comments.length,
        data: {
            data: comments,
        },
    });
});

exports.getComment = catchAsync(async (req, res, next) => {
    const comment = await Comment.findOne({ _id: req.params.id });
    if (!comment)
        return next(
            new AppError(
                `Comment belonging to Id: ${req.params.id} does not exists.`,
                400
            )
        );
    res.status(200).json({
        status: "success",
        data: {
            data: comment,
        },
    });
});

exports.setBlogUserId = catchAsync(async (req, res, next) => {
    if (!req.body.blog) req.body.blog = req.params.blogId;
    if (!req.body.user) req.body.user = req.user.id;
    next();
});

exports.createComment = catchAsync(async (req, res, next) => {
    const comment = await Comment.create(req.body);
    res.status(200).json({
        status: "success",
        data: {
            data: comment,
        },
    });
});

exports.updateComment = catchAsync(async (req, res, next) => {
    const updatedComment = await Comment.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );
    if (!updatedComment)
        return next(
            new AppError(
                `Comment belonging to Id: ${req.params.id} does not exists.`,
                400
            )
        );
    res.status(200).json({
        status: "success",
        data: {
            data: updatedComment,
        },
    });
});

exports.deleteComment = catchAsync(async (req, res, next) => {
    const deletedComment = await Comment.findByIdAndDelete(req.params.id);
    if (!deletedComment)
        return next(
            new AppError(
                `Comment belonging to Id: ${req.params.id} does not exists.`,
                400
            )
        );
    res.status(204).json({
        status: "success",
        data: {
            data: deletedComment,
        },
    });
});
