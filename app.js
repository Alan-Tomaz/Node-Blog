// Loading Modules
const express = require('express');
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express();
const admin = require('./routes/admin');
const path = require("path");
const mongoose = require('mongoose');
const session = require("express-session");
const flash = require("connect-flash");

// Configs
// Session
app.use(session({
    secret: "2hSwga23F3*d0:%'4Eg8|_5>I1*/ZG!N",
    resave: true,
    saveUninitialized: true
}))
app.use(flash());
// Middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg")
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
app.get('/', (req, res) => {
    res.send("Principal Route")
})

app.get('/posts', (req, res) => {
    res.send("Posts List")
})

app.use('/admin', admin);


// Others
const PORT = 3000;
app.listen(PORT, () => {
    console.log("Server is Running")
})