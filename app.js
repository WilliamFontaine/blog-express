require('dotenv').config();

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const sessions = require('express-session');

/* --------------------------------- express ------------------------------------- */

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views', 'pages'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(sessions({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    cookie: { maxAge:  1000 * 60 * 60 * 24 },
    resave: false
}));
app.use(cookieParser());
/* --------------------------------- mongoose ------------------------------------ */

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true });

/* ---------------------------------- routes ------------------------------------- */

require('./src/routes/auth')(app);
require('./src/routes/products')(app);

app.use((req, res) => {
    res.redirect('/products');
});

/* ---------------------------------- server ------------------------------------- */

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server started: http://localhost:${process.env.PORT || 3000}/`);
});