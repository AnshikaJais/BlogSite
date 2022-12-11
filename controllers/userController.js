const User = require("../models/userModel");
const catchAsync = require("../utilities/catchAsync");
const AppError = require("../utilities/appError");

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        status: "success",
        result: users.length,
        data: {
            data: users,
        },
    });
});

exports.getUser = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ _id: req.params.id });
    if (!user)
        return next(
            new AppError(
                `User belonging to Id: ${req.params.id} does not exists.`,
                400
            )
        );
    res.status(200).json({
        status: "success",
        data: {
            data: user,
        },
    });
});

exports.createUser = catchAsync(async (req, res, next) => {
    const user = await User.create(req.body);
    res.status(200).json({
        status: "success",
        data: {
            data: user,
        },
    });
});

exports.updateUser = catchAsync(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!updatedUser)
        return next(
            new AppError(
                `User belonging to Id: ${req.params.id} does not exists.`,
                400
            )
        );
    res.status(200).json({
        status: "success",
        data: {
            data: updatedUser,
        },
    });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser)
        return next(
            new AppError(
                `User belonging to Id: ${req.params.id} does not exists.`,
                400
            )
        );
    res.status(204).json({
        status: "success",
        data: {
            data: deletedUser,
        },
    });
});
