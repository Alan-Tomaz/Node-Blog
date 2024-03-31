// Declarations
const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Category');
const Category = mongoose.model('categories')
require('../models/Post');
const Post = mongoose.model('posts')

// Routes
router.get('/', (req, res) => {
    res.render("admin/index");
});

router.get('/categories', (req, res) => {
    Category.find().sort({ date: 'desc' }).then((categories) => {
        res.render("admin/categories", { categories: categories });
    }).catch((err) => {
        req.flash("error_msg", "Error in Category Listing, Try Again!");
        res.redirect("/admin");
    });
});

router.get('/categories/add', (req, res) => {
    res.render("admin/add-categories")
});

router.post('/categories/new', (req, res) => {

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

router.get("/categories/edit/:id", (req, res) => {
    Category.findOne({ _id: req.params.id }).then((category) => {
        res.render("admin/edit-categories", { category: category });
    }).catch((err) => {
        req.flash("error_msg", "This Category Doesn't Exists");
        res.redirect("/admin/categories")
    });
});

router.post("/categories/edit", (req, res) => {
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

router.post("/categories/delete", (req, res) => {
    Category.deleteOne({ _id: req.body.id }).then(() => {
        req.flash("success_msg", "Category Deleted Successfully");
        res.redirect("/admin/categories")
    }).catch((err) => {
        req.flash("error_msg", "Error in Category Delete, Try Again!");
        res.redirect("/admin/categories")
    });
})

router.get("/posts", (req, res) => {
    res.render("admin/posts");
})

router.get("/posts/add", (req, res) => {
    Category.find().then((categories) => {
        res.render("admin/add-posts", { categories: categories });
    }).catch((err) => {
        req.flash("error_msg", "Error in Form Load, Try Again!");
        res.redirect("/admin")
    })
})

router.post("/posts/new", (req, res) => {
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

module.exports = router;