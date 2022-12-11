const catchAsync = require("../utilities/catchAsync");
const Blog = require("../models/blogModel");

exports.getOverview = catchAsync(async (req, res, next) => {
    const blogs = await Blog.find();
    res.status(200).render("overview", {
        title: "All Blogs",
        blogs,
    });
});

exports.getBlog = catchAsync(async (req, res, next) => {
    if (res.locals.user !== null) {
        const blog = await Blog.findOne({ title: req.params.title }).populate({
            path: "comments",
            fields: "createdAt comment user",
        });
        blog.createdAt.toLocaleString("en-us");
        res.status(200).render("blog", {
            title: "Blog",
            blog,
        });
    } else {
        res.redirect("/overview");
    }
});

exports.postComment = catchAsync(async (req, res, next) => {
    res.status(200).redirect("blog");
});

exports.renderBlogTemplate = catchAsync(async (req, res, next) => {
    if (res.locals.user !== null) {
        console.log(res.locals.user);
        res.status(200).render("post", { title: "New Blog" });
    } else res.redirect("/overview");
});

exports.createBlog = catchAsync(async (req, res, next) => {
    res.status(200).redirect("/overview", { title: "All Blogs" });
});

exports.getLogin = async (req, res) => {
    res.status(200).render("login", { title: "Login" });
};

exports.getSignup = async (req, res, next) => {
    res.status(200).render("signup", { title: "Sign up" });
};

exports.getContact = async (req, res, next) => {
    res.status(200).render("contact", {
        title: "Contact us",
    });
};

exports.getAbout = async (req, res, next) => {
    res.status(200).render("about", { title: "About us" });
};
