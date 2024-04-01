// Declarations
const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Category');
const Category = mongoose.model('categories')
require('../models/Post');
const Post = mongoose.model('posts')
const { isAdmin } = require('../helpers/isAdmin');
require('../models/User');
const User = mongoose.model('users')
const bcrypt = require("bcryptjs");



// Routes
router.get('/', isAdmin, (req, res) => {
    res.render("admin/index");
});

router.get('/categories', isAdmin, (req, res) => {
    Category.find().sort({ date: 'desc' }).then((categories) => {
        res.render("admin/categories", { categories: categories });
    }).catch((err) => {
        req.flash("error_msg", "Error in Category Listing, Try Again!");
        res.redirect("/admin");
    });
});

router.get('/categories/add', isAdmin, (req, res) => {
    res.render("admin/add-categories")
});

router.post('/categories/new', isAdmin, (req, res) => {

    const errors = [];

    if (!req.body.name || typeof req.body.name == undefined || req.body.name == null) {
        errors.push({ text: "Invalid Name" });
    }

    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        errors.push({ text: "Invalid Slug" });
    }

    if (req.body.name.length < 2) {
        errors.push({ text: "Name Too Short" })
    }

    if (errors.length > 0) {
        res.render('admin/add-categories', { errors: errors });
    }

    else {
        const newCategory = {
            name: req.body.name,
            slug: req.body.slug
        }

        new Category(newCategory).save().then(() => {
            req.flash("success_msg", "Category Added Successfully");
            res.redirect('/admin/categories');
        }).catch((err) => {
            req.flash("success_msg", "Error in Category Save, Try Again!");
            res.redirect("/admin");
        })
    }
});

router.get("/categories/edit/:id", isAdmin, (req, res) => {
    Category.findOne({ _id: req.params.id }).then((category) => {
        res.render("admin/edit-categories", { category: category });
    }).catch((err) => {
        req.flash("error_msg", "This Category Doesn't Exists");
        res.redirect("/admin/categories")
    });
});

router.post("/categories/edit", isAdmin, (req, res) => {
    const errors = [];

    if (!req.body.name || typeof req.body.name == undefined || req.body.name == null) {
        errors.push({ text: "Invalid Name" });
    }

    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        errors.push({ text: "Invalid Slug" });
    }

    if (req.body.name.length < 2) {
        errors.push({ text: "Name Too Short" })
    }

    if (errors.length > 0) {
        res.render('admin/edit-categories', { errors: errors });
    }

    else {
        Category.findOne({ _id: req.body.id }).then((category) => {

            category.name = req.body.name;
            category.slug = req.body.slug;

            category.save().then(() => {
                req.flash("success_msg", "Category Edit Successfully");
                res.redirect("/admin/categories")
            }).catch((err) => {
                req.flash("error_msg", "Error in Category Edit Save, Try Again!");
                res.redirect("/admin/categories")
            })

        }).catch((err) => {
            req.flash("error_msg", "Error in Category Edit, Try Again!");
            res.redirect("/admin/categories")
        })
    }
})

router.post("/categories/delete", isAdmin, (req, res) => {
    Category.deleteOne({ _id: req.body.id }).then(() => {
        req.flash("success_msg", "Category Deleted Successfully");
        res.redirect("/admin/categories")
    }).catch((err) => {
        req.flash("error_msg", "Error in Category Delete, Try Again!");
        res.redirect("/admin/categories")
    });
})

router.get("/posts", isAdmin, (req, res) => {
    Post.find().lean().populate('category').sort({ data: "desc" }).then((posts) => {
        res.render("admin/posts", { posts: posts });
    }).catch((err) => {
        req.flash("error_msg", "Error in Posts List. Try Again!");
        res.redirect("/admin");
    });
})

router.get("/posts/add", isAdmin, (req, res) => {
    Category.find().then((categories) => {
        res.render("admin/add-posts", { categories: categories });
    }).catch((err) => {
        req.flash("error_msg", "Error in Form Load, Try Again!");
        res.redirect("/admin")
    })
})

router.post("/posts/new", isAdmin, (req, res) => {
    const errors = [];

    if (!req.body.title || typeof req.body.title == undefined || req.body.title == null) {
        errors.push({ text: "Invalid Title" });
    }

    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        errors.push({ text: "Invalid Slug" });
    }

    if (!req.body.content || typeof req.body.content == undefined || req.body.content == null) {
        errors.push({ text: "Invalid Content" });
    }

    if (!req.body.description || typeof req.body.description == undefined || req.body.description == null) {
        errors.push({ text: "Invalid Description" });
    }

    if (req.body.title.length < 2) {
        errors.push({ text: "Title Too Short" })
    }

    if (req.body.title.description < 2) {
        errors.push({ text: "Description Too Short" })
    }

    if (req.body.title.content < 2) {
        errors.push({ text: "Content Too Short" })
    }

    if (req.body.category == "0") {
        errors.push({ text: "Invalid Category. Register a Category" });
    }

    if (errors.length > 0) {
        res.render('admin/add-posts', { errors: errors });
    }

    else {
        const newPost = {
            title: req.body.title,
            slug: req.body.slug,
            description: req.body.description,
            content: req.body.content,
            category: req.body.category
        }

        new Post(newPost).save().then(() => {
            req.flash("success_msg", "Post created Successfully!");
            res.redirect("/admin/posts");
        }).catch((err) => {
            req.flash("error_msg", "Error in Post Save, Try Again!")
            res.redirect("/admin/posts");
        })
    }

})

router.get("/posts/edit/:id", isAdmin, (req, res) => {
    Post.findOne({ _id: req.params.id }).then((post) => {
        Category.find().then((categories) => {
            res.render("admin/edit-posts", { post: post, categories: categories });
        }).catch((err) => {
            req.flash("error_msg", "Error in Post Category List, Try Again!")
            res.redirect("/admin/posts")
        })
    }).catch((err) => {
        req.flash("error_msg", "Error in Post Edit Form, Try Again!")
        res.redirect("/admin/posts")
    });
})

router.post("/posts/edit", isAdmin, (req, res) => {
    const errors = [];

    if (!req.body.title || typeof req.body.title == undefined || req.body.title == null) {
        errors.push({ text: "Invalid Title" });
    }

    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        errors.push({ text: "Invalid Slug" });
    }

    if (!req.body.content || typeof req.body.content == undefined || req.body.content == null) {
        errors.push({ text: "Invalid Content" });
    }

    if (!req.body.description || typeof req.body.description == undefined || req.body.description == null) {
        errors.push({ text: "Invalid Description" });
    }

    if (req.body.title.length < 2) {
        errors.push({ text: "Title Too Short" })
    }

    if (req.body.title.description < 2) {
        errors.push({ text: "Description Too Short" })
    }

    if (req.body.title.content < 2) {
        errors.push({ text: "Content Too Short" })
    }

    if (req.body.category == "0") {
        errors.push({ text: "Invalid Category. Register a Category" });
    }

    if (errors.length > 0) {
        res.render('admin/edit-posts', { errors: errors });
    }

    else {
        Post.findOne({ _id: req.body.id }).then((post) => {

            post.title = req.body.title;
            post.slug = req.body.slug;
            post.description = req.body.description;
            post.content = req.body.content;
            post.category = req.body.category;

            post.save().then(() => {
                req.flash("success_msg", "Post Edit Successfully");
                res.redirect("/admin/posts")
            }).catch((err) => {
                req.flash("error_msg", "Error in Post Edit Save, Try Again!");
                res.redirect("/admin/posts")
            })

        }).catch((err) => {
            req.flash("error_msg", "Error in Post Edit, Try Again!");
            res.redirect("/admin/posts")
            console.log(err);
        })
    }
})

router.get("/posts/delete/:id", isAdmin, (req, res) => {
    Post.deleteOne({ _id: req.params.id }).then(() => {
        req.flash("success_msg", "Post Deleted Successfully");
        res.redirect("/admin/posts")
    }).catch((err) => {
        req.flash("error_msg", "Error in Post Delete, Try Again!");
        res.redirect("/admin/posts")
    });
})

router.get("/users", isAdmin, (req, res) => {
    User.find().sort({ username: 'desc' }).then((users) => {
        res.render("admin/users", { users: users });
    }).catch((err) => {
        req.flash("error_msg", "Error in Users Listing, Try Again!");
        res.redirect("/admin");
    });
})

router.get("/users/edit/:id", isAdmin, (req, res) => {
    User.findOne({ _id: req.params.id }).then((user) => {
        res.render("admin/edit-users", { theUser: user });
    }).catch((err) => {
        req.flash("error_msg", "Error in Users Edit, Try Again!");
        res.redirect("/admin");
    });
})

router.post("/users/edit", isAdmin, (req, res) => {
    const errors = [];

    if (!req.body.username || typeof req.body.username == undefined || req.body.username == null) {
        errors.push({ text: "Invalid Name" });
    }

    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        errors.push({ text: "Invalid Email" });
    }

    if (req.body.username.length < 2) {
        errors.push({ text: "Username Too Short" })
    }

    if (req.body.password != '' && req.body.password_2 != '') {
        if (req.body.password < 8) {
            errors.push({ text: "Password Too Short" })
        }

        if (req.body.password_2 < 8) {
            errors.push({ text: "Rewrite Password Too Short" })
        }

        if (req.body.password != req.body.password_2) {
            errors.push({ text: "Passwords don't match" });
        }
    }

    if (errors.length > 0) {
        res.render('admin/edit-users', { errors: errors });
    }

    else {
        User.findOne({ email: req.body.email }).then((user) => {
            if (user) {
                if (user.id != req.body.id) {
                    req.flash("error_msg", "Alread Exists a Account with this Email!")
                    res.redirect("/users/edit/" + req.body.id)
                }
                else {
                    user.username = req.body.username;
                    user.email = req.body.email;
                    user.isAdmin = Number(req.body.isAdmin);

                    if (req.body.password != '' && req.body.password_2 != '') {
                        user.password = req.body.password;
                        bcrypt.genSalt(10, (err, salt) => {
                            bcrypt.hash(user.password, salt, (err, hash) => {
                                if (err) {
                                    req.flash("error_msg", "Error in User Edit")
                                    res.redirect("/");
                                    console.log(err)
                                }
                                else {
                                    user.password = hash;

                                    user.save().then(() => {
                                        req.flash("success_msg", "User Edited Successfully");
                                        res.redirect("/");
                                        console.log(err)
                                    }).catch((err) => {
                                        req.flash("error_msg", "Error in User Edit");
                                        res.redirect("/");
                                        console.log(err)
                                    });
                                }
                            })
                        })
                    } else {
                        user.save().then(() => {
                            req.flash("success_msg", "User Edited Successfully");
                            res.redirect("/");
                        }).catch((err) => {
                            req.flash("error_msg", "Error in User Edit");
                            res.redirect("/");
                            console.log(err)
                        });
                    }
                }
            }
        }).catch((err) => {
            req.flash("error_msg", "Internal Error");
            res.redirect("/");
            console.log(err)
        })
    }
})

router.post("/users/delete", isAdmin, (req, res) => {
    User.deleteOne({ _id: req.body.id }).then(() => {
        req.flash("success_msg", "User Deleted Successfully");
        res.redirect("/admin/users")
    }).catch((err) => {
        req.flash("error_msg", "Error in User Delete, Try Again!");
        res.redirect("/admin/users")
    });
})



module.exports = router;
