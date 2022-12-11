const mongoose = require("mongoose");

process.on("uncaughtException", function (err) {
    console.log("UNCAUGHT EXCEPTION 💥. Shutting down");
    console.log(err.name, err.message, err.stack);
});
require("dotenv").config({ path: "./config.env" });
const app = require("./app");

const DB = process.env.DATABASE.replace(
    "<DATABASE_NAME>",
    process.env.DATABASE_NAME
).replace("<PASSWORD>", process.env.DATABASE_PASSWORD);

mongoose
    .connect(DB, {
        useNewUrlParser: true,
    })
    // eslint-disable-next-line no-console
    .then(() => console.log("DB connection successful!"));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
    console.log("UNHANDLED REJECTION! 💥 Shutting down...");
    console.log(err.name, err.message, err.stack);
    server.close(() => {
        process.exit(1);
    });
});
