const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejsLayouts = require("express-ejs-layouts");
const cookieParser = require('cookie-parser'); // Require cookie-parser

const app = express();

// Import middleware
const cookieMiddleware = require('./middleware/cookieMiddleware');
const sessionMiddleware = require('./middleware/sessionMiddleware');
const authenticationMiddleware = require('./middleware/authenticationMiddleware');

// Import routes
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const pageRoutes = require('./routes/pageRoutes');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/blogs-users', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
});

// Set up body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static("public"));
app.use(express.static("assets"));

// Set the view engine to EJS
app.set("view engine", "ejs");
app.use(ejsLayouts);

// Use cookie-parser middleware
app.use(cookieParser());

// Use middleware
app.use(cookieMiddleware);
app.use(sessionMiddleware);
app.use(authenticationMiddleware);
app.use(express.json());

// Use routes
app.use(authRoutes);
app.use(blogRoutes);
app.use(pageRoutes);

// Start the server
const PORT = process.env.PORT || 7878;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
