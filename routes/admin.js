// Declarations
const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Category');
const Category = mongoose.model('categories')

// Routes
router.get('/', (req, res) => {
    res.render("admin/index");
});

router.get('/posts', (req, res) => {
    res.send("Posts Page")
});

router.get('/categories', (req, res) => {
    res.render("admin/categories")
});

router.get('/categories/add', (req, res) => {
    res.render("admin/add-categories")
});

router.post('/categories/new', (req, res) => {
    const newCategory = {
        name: req.body.name,
        slug: req.body.slug
    }

    new Category(newCategory).save().then(() => {
        console.log("Category Added Successfully")
    }).catch((err) => {
        console.log("Error saving category: " + err)
    })
});

router.get('/test', (req, res) => {
    res.send("This is a Test")
});

module.exports = router;