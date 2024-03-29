// Loading Modules
const express = require('express');
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express();
/* const mongoose = require('mongoose'); */

// Configs

// Routes

// Others
const PORT = 3000;
app.listen(PORT, () => {
    console.log("Server is Running")
})