// Loading Modules
const express = require('express');
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express();
const admin = require('./routes/admin');
const users = require('./routes/user');
const path = require("path");
const mongoose = require('mongoose');
const session = require("express-session");
const flash = require("connect-flash");
require('./models/Post');
const Post = mongoose.model("posts");
require('./models/Category');
const Category = mongoose.model("categories");
const passport = require("passport");
require("./config/auth")(passport);

// Configs
// Session
app.use(session({
    secret: "2hSwga23F3*d0:%'4Eg8|_5>I1*/ZG!N",
    resave: true,
    saveUninitialized: true
}))
//Passport
app.use(passport.initialize());
app.use(passport.session());
//Flash
app.use(flash());
// Middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
    next();
})
// Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Handlebars
app.engine('handlebars', handlebars.engine({
    defaultLayout: 'main', runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
}));
app.set('view engine', 'handlebars');
// Mongoose
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/node_blog',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("MongoDB Connected Successfully")
    }).catch((err) => {
        console.log("Error Ocurred : " + err)
    });
// Public
app.use(express.static(path.join(__dirname, 'public')));

// Routes

app.get("/post/:slug", (req, res) => {
    Post.findOne({ slug: req.params.slug }).then((post) => {
        if (post) {
            res.render("post/index", { post: post });
        } else {
            req.flash("error_msg", "This Post Doesn't Exists");
            res.redirect("/");
        }
    }).catch((err) => {
        req.flash("error_msg", "Internal Error");
        res.redirect("/");
    })
})

app.get('/', (req, res) => {
    Post.find().lean().populate('category').sort({ date: 'desc' }).then((posts) => {
        res.render("index", { posts: posts });
    }).catch((err) => {
        req.flash("error_msg", "Internal Error");
        res.redirect("/404");
    })
})

app.get('/categories', (req, res) => {
    Category.find().sort({ date: 'desc' }).then((categories) => {
        res.render("categories/index", { categories: categories })
    }).catch((err) => {
        req.flash("error_msg", "Internal Error");
        res.redirect("/");
    })
})

app.get('/categories/:slug', (req, res) => {
    Category.findOne({ slug: req.params.slug }).then((category) => {
        if (category) {
            Post.find({ category: category._id }).sort({ date: 'desc' }).then((posts) => {
                res.render("categories/posts", { posts: posts, category: category })
            }).catch((err) => {
                req.flash("error_msg", "Error in Posts List");
                res.redirect("/");
            })
        } else {
            req.flash("error_msg", "This Category Doesn't Exists");
            res.redirect("/");
        }
    }).catch((err) => {
        req.flash("error_msg", "Internal Error");
        res.redirect("/");
    })
})

app.get('/404', (req, res) => {
    res.send("Error 404");
})

app.use('/admin', admin);
app.use('/users', users);


// Others
const PORT = 3000;
app.listen(PORT, () => {
    console.log("Server is Running")
})