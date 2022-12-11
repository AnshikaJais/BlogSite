import { postComment, postBlog } from "./postCommentBlog";
import { login, logout, signup } from "./loginSignup";

//VALUES
const loginForm = document.querySelector(".login-form");
const logoutBtn = document.getElementById("logout-btn");
const warning = document.querySelector(".overview-container .warning");
const commentForm = document.querySelector(".comment-form");
const signupForm = document.querySelector(".signup-form");
const postBlogForm = document.querySelector(".post-blog-form");

if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;
        login(email, password);
    });
}
if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
}

if (commentForm) {
    commentForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const comment = document.getElementById("comment").value;
        const blog = document.querySelector("input[name=blog]").value;
        const user = document.querySelector("input[name=user]").value;
        console.log(comment, blog, user);
        postComment(comment, blog, user);
    });
}

if (warning) {
    warning.style.display = "none";
}

if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("signup-name").value;
        const email = document.getElementById("signup-email").value;
        const password = document.getElementById("signup-password").value;
        const passwordConfirm = document.getElementById(
            "signup-passwordConfirm"
        ).value;
        signup(name, email, password, passwordConfirm);
    });
}

if (postBlogForm) {
    postBlogForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.querySelector("input[name=blog-user-name]").value;
        const email = document.querySelector(
            "input[name=blog-user-email]"
        ).value;
        const title = document.getElementById("blog-title").value;
        const subTitle = document.getElementById("blog-subtitle").value;
        const description = document.getElementById("blog-description").value;
        const user = document.querySelector("input[name=blog-user-id]").value;
        postBlog(name, email, title, subTitle, description, user);
    });
}
