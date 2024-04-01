const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/User');
const User = mongoose.model('users');
const bcrypt = require("bcryptjs");
const passport = require('passport');

router.get('/register', (req, res) => {
    res.render("users/register");
})

router.post("/register", (req, res) => {
    const errors = [];

    if (!req.body.username || typeof req.body.username == undefined || req.body.username == null) {
        errors.push({ text: "Invalid Name" });
    }

    if (!req.body.password || typeof req.body.password == undefined || req.body.password == null) {
        errors.push({ text: "Invalid Password" });
    }

    if (!req.body.password_2 || typeof req.body.password_2 == undefined || req.body.password_2 == null) {
        errors.push({ text: "Invalid Rewrite Password" });
    }

    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        errors.push({ text: "Invalid Email" });
    }

    if (req.body.username.length < 2) {
        errors.push({ text: "Username Too Short" })
    }

    if (req.body.password < 8) {
        errors.push({ text: "Password Too Short" })
    }

    if (req.body.password_2 < 8) {
        errors.push({ text: "Rewrite Password Too Short" })
    }

    if (req.body.password != req.body.password_2) {
        errors.push({ text: "Passwords don't match" });
    }

    if (errors.length > 0) {
        res.render('users/register', { errors: errors });
    }

    else {
        User.findOne({ email: req.body.email }).then((user) => {
            if (user) {
                req.flash("error_msg", "Alread Exists a Account with this Email!")
                res.redirect("/users/register")
            } else {
                const newUser = new User({
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password
                })

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) {
                            req.flash("error_msg", "Error in User Save")
                            res.redirect("/");
                        }
                        else {
                            newUser.password = hash;

                            newUser.save().then(() => {
                                req.flash("success_msg", "User created Successfully");
                                res.redirect("/");
                            }).catch((err) => {
                                req.flash("error_msg", "Error in User Save");
                                res.redirect("/");
                            });
                        }
                    })
                })
            }
        }).catch(() => {
            req.flash("error_msg", "Internal Error");
            res.redirect("/");
        })
    }
})

router.get('/login', (req, res) => {
    res.render("users/login");
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
})

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        req.flash("success_msg", "Successfully Desloged")
        res.redirect('/');
    });
}
)

module.exports = router;