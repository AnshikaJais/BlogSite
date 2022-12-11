const express = require("express");
const viewController = require("../controllers/viewController");
const authController = require("../controllers/authController");
const router = express.Router();

router.use(authController.isLoggedIn);
router.get("/overview", viewController.getOverview);
router
    .route("/post")
    .get(viewController.renderBlogTemplate)
    .post(viewController.createBlog);
router
    .route("/blog/:title")
    .get(viewController.getBlog)
    .post(viewController.postComment);

router.route("/login").get(viewController.getLogin);
router.route("/signup").get(viewController.getSignup);
router.route("/contact").get(viewController.getContact);
router.route("/about").get(viewController.getAbout);

module.exports = router;
