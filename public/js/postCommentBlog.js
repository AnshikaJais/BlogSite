import axios from "axios";

export const postComment = async (comment, blog, user) => {
    try {
        const res = await axios({
            method: "POST",
            url: "http://127.0.0.1:3000/api/v1/comments",
            data: {
                comment,
                blog,
                user,
            },
        });
        if (res.data.status == "success") {
            alert("send Comment successfully");
            window.setTimeout(() => {
                location.reload(true);
            }, 500);
        }
    } catch (err) {
        alert(err.response.data.message);
    }
};

export const postBlog = async (
    name,
    email,
    title,
    subTitle,
    description,
    user
) => {
    try {
        const res = await axios({
            method: "POST",
            url: "http://127.0.0.1:3000/api/v1/blogs",
            data: {
                name,
                email,
                title,
                subTitle,
                description,
                user,
            },
        });
        if (res.data.status === "success") {
            alert("Blog posted!");
            window.setTimeout(() => {
                location.assign(`/blog/${title}`);
            }, 1500);
        }
    } catch (err) {
        alert(err);
    }
};
