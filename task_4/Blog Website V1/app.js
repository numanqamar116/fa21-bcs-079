const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejsLayouts = require("express-ejs-layouts");
const cookieParser = require('cookie-parser');

const app = express();

const cookieMiddleware = require('./middleware/cookieMiddleware');
const sessionMiddleware = require('./middleware/sessionMiddleware');
const authenticationMiddleware = require('./middleware/authenticationMiddleware');


const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const pageRoutes = require('./routes/pageRoutes');


mongoose.connect('mongodb://localhost:27017/blogs-users', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
});


app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));
app.use(express.static("assets"));


app.set("view engine", "ejs");
app.use(ejsLayouts);


app.use(cookieParser());


app.use(cookieMiddleware);
app.use(sessionMiddleware);
app.use(authenticationMiddleware);
app.use(express.json());

app.use(authRoutes);
app.use(blogRoutes);
app.use(pageRoutes);


const PORT = process.env.PORT || 7878;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
