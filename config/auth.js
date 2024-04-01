const localStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// User model
require("../models/User");
const User = mongoose.model("users");

module.exports = function (passport) {
    passport.use(new localStrategy({ usernameField: 'email', passwordField: 'password' }, (email, password, done) => {
        User.findOne({ email: email }).then((user) => {
            if (!user) {
                return done(null, false, { message: "This Account Doesn't Exists" });
            } else {
                bcrypt.compare(password, user.password, (err, check) => {
                    if (check) {
                        return done(null, user);
                    }
                    else {
                        done(null, false, { message: "Password Incorret" })
                    }
                })
            }
        })
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id).then((user) => {
            done(null, user);
        }).catch((err) => {
            done(null, false, { message: 'Something goes Wrong' })
        })
    })
}
