const { Schema, model } = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please mention your name."],
    },
    photo: {
        type: String,
        default: "user-1.jpg",
    },
    email: {
        type: String,
        required: [true, "Please provide your email"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
        type: String,
        required: [true, "Please write your password"],
        minlength: 8,
        select: false,
    },

    passwordConfirm: {
        type: String,
        required: [true, "Please confirm your password"],
        validate: {
            // This only works on CREATE and SAVE!!!
            validator: function (el) {
                return el === this.password;
            },
            message: "Passwords are not the same!",
        },
    },
    role: {
        type: String,
        default: "user",
    },
});

userSchema.pre("save", async function (next) {
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.correctPassword = function (candidatePass, actualPass) {
    return bcrypt.compare(candidatePass, actualPass);
};

const User = new model("User", userSchema);
module.exports = User;
