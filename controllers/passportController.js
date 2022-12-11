const app = require("../app");
const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const findOrCreate = require("mongoose-findorcreate");
const User = require("../models/userModel");

app.use(
    session({
        secret: "Out little secret",
        resave: false,
        saveUninitialized: false,
    })
);

app.use(passport.initialize());
app.use(passport.session());

//To create cookie
passport.use(User.createStrategy());
passport.serializeUser((user, done) => {
    done(null, user.id);
});
//To destroy cookie
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: "http://localhost:3000/auth/google/overview",
        },
        function (request, accessToken, refreshToken, profile, done) {
            console.log(profile._json.email);
            User.findOrCreate(
                { googleId: profile.id, username: profile._json.email },
                (err, user) => {
                    return done(err, user);
                }
            );
        }
    )
);

passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: "http://localhost:3000/auth/github/overview",
        },
        function (accessToken, refreshToken, profile, done) {
            console.log(profile);
            User.findOrCreate(
                { githubId: profile.id, username: profile.profileUrl },
                function (err, user) {
                    return done(err, user);
                }
            );
        }
    )
);

module.export = passport;
