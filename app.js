// Loading Modules
const express = require('express');
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express();
const admin = require('./routes/admin');
const path = require("path");
const mongoose = require('mongoose');


// Configs
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