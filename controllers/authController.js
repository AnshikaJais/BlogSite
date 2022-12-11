const catchAsync = require("../utilities/catchAsync");
const AppError = require("../utilities/appError");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const createAndSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };
    if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
    res.cookie("jwt", token, cookieOptions);

    //Remove password from output
    user.password = undefined;
    res.status(statusCode).json({
        status: "success",
        message: "Logged in",
        token,
        data: {
            user,
        },
    });
};

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create(req.body);
    createAndSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password)
        return next(
            new AppError("Please provide your email and passpord!", 400)
        );
    const user = await User.findOne({ email }).select("password");
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError("Incorrect email or password!", 401));
    }
    createAndSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
    // 1) Getting token and check if it exists.
    let token;
    //Accessing token from Bearer token in postman
    if (req.headers.authorization?.startsWith("Bearer"))
        token = req.headers.authorization.split(" ")[1];
    //Accessing token from cookie to use in front-end
    else if (req.cookies && req.cookies.jwt) token = req.cookies.jwt;
    if (!token)
        return next(
            new AppError(
                "you are not logged in! Please log in to get access.",
                401
            )
        );
    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser)
        return next(
            new AppError(
                "The user belonging to this token doed not exists",
                401
            )
        );
    // 4) Grant access to protected route
    req.user = currentUser;
    next();
});

//For templates only, save current user to res.locals, if user is
// logged in show them "logout" else "login" and "signup" options.
exports.isLoggedIn = catchAsync(async (req, res, next) => {
    // 1) Getting token and check if it exists.
    if (req.cookies.jwt) {
        try {
            let token;
            token = req.cookies.jwt;
            // 2) Verification token
            const decoded = await promisify(jwt.verify)(
                token,
                process.env.JWT_SECRET
            );
            // 3) Check if user still exists
            const currentUser = await User.findById(decoded.id);
            if (!currentUser) return next();
            // 4) Grant access to protected route
            //req.locals is accessed to evry template
            res.locals.user = currentUser;
            return next();
        } catch (err) {
            return next();
        }
    }
    return next();
});

exports.logout = (req, res) => {
    res.cookie("jwt", "loggedOut", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({ status: "success" });
};
