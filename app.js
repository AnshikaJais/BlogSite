const express = require("express");
const path = require("path");
const viewRouter = require("./routes/viewRouter");
const blogRouter = require("./routes/blogRouter");
const userRouter = require("./routes/userRouter");
const commentRouter = require("./routes/commentRouter");
const AppError = require("./utilities/appError");
const globalErrorHandler = require("./controllers/errorHandler");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", require("express-ejs-extend"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

app.use((req, res, next) => {
    res.locals.user = null;
    next();
});
app.use("/", viewRouter);
app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/comments", commentRouter);

//Global Errors
app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
