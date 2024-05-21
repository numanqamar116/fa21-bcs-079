const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    res.render("main", { title: "Homepage", user: req.session.user });
});

router.get("/home", (req, res) => {
    res.render("main", { title: "Home", user: req.session.user });
});

router.get("/contact-us", (req, res) => {
    res.render("contact", { title: "Contact Us", user: req.session.user });
});

router.get("/categories/:category", (req, res) => {
    const category = req.params.category;
    res.render("categories", { title: `Category: ${category}`, category, user: req.session.user });
});

router.get("/editBlog", (req, res) => {
    if (req.session.user) {
        res.render("EditBlog", { title: "Edit Blog", user: req.session.user });
    } else {
        res.redirect('/signup');
    }
});

router.get("/about", (req, res) => {
    res.render("about", { title: "About", user: req.session.user });
});




module.exports = router;
