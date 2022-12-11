import axios from "axios";

export const login = async (email, password) => {
    try {
        console.log(email, password);
        const res = await axios({
            method: "POST",
            url: "http://127.0.0.1:3000/api/v1/users/login",
            data: {
                email,
                password,
            },
        });
        if (res.data.status == "success") {
            alert("Logged in successfully!");
            window.setTimeout(() => {
                location.assign("/overview");
            }, 500);
        }
    } catch (err) {
        alert(err.response.data.message);
    }
};

export const logout = async () => {
    const res = await axios({
        method: "GET",
        url: "http://127.0.0.1:3000/api/v1/users/logout",
    });
    location.reload(true); // to reload data from server set to true, else it would have loaded from catch.
};

export const signup = async (name, email, password, passwordConfirm) => {
    try {
        const res = await axios({
            method: "POST",
            url: "http://127.0.0.1:3000/api/v1/users/signup",
            data: {
                name,
                email,
                password,
                passwordConfirm,
            },
        });
        if (res.data.status === "success") {
            alert("Signup successfully");
            window.setTimeout(() => {
                location.assign("/overview");
            }, 1000);
        }
    } catch (err) {
        alert(err.response.data.message);
    }
};
