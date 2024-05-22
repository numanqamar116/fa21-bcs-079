const express = require('express');
const router = express.Router();
const User = require('../models/user-model');

// Signup route
router.get("/signup", (req, res) => {
    res.render("signup", { title: "Sign Up", errorMessage: '', layout: "authLayout" });
});

router.post("/signup", (req, res) => {
    const { name, email, password } = req.body;

    // Check for existing user with the same email
    User.findOne({ email })
        .then(existingUser => {
            if (existingUser) {
                res.render('signup', {
                    title: "Sign Up",
                    errorMessage: 'Email already exists',
                    layout: "authLayout"
                });
            } else {
                // Check for existing user with the same name
                User.findOne({ name })
                    .then(existingUserWithName => {
                        if (existingUserWithName) {
                            res.render('signup', {
                                title: "Sign Up",
                                errorMessage: 'The User with this name already exists, please try a different name',
                                layout: "authLayout"
                            });
                        } else {
                            const newUser = new User({ name, email, password });
                            newUser.save()
                                .then(savedUser => {
                                    console.log('User saved successfully:', savedUser);
                                    res.redirect('/signin');
                                })
                                .catch(err => {
                                    console.error('Error saving user:', err);
                                    res.status(500).send('Error signing up user');
                                });
                        }
                    })
                    .catch(err => {
                        console.error('Error checking for existing user name:', err);
                        res.status(500).send('Error signing up user');
                    });
            }
        })
        .catch(err => {
            console.error('Error checking for existing user email:', err);
            res.status(500).send('Error signing up user');
        });
});


// Signin route
router.get("/signin", (req, res) => {
    res.render("signin", { title: "Sign In", errorMessage: '', layout: "authLayout" });
});

router.post("/signin", (req, res) => {
    const { email, password } = req.body;

    User.findOne({ email })
        .then(user => {
            if (user) {
                if (user.password === password) {
                    req.session.user = user;
                    res.redirect('/home');
                } else {
                    res.render('signin', {title: "Sign In", errorMessage: 'Email or password incorrect', layout: "authLayout" });
                }
            } else {
                res.render('signin', {title: "Sign In", errorMessage: 'Email or password incorrect', layout: "authLayout" });
            }
        })
        .catch(err => {
            console.error('Error signing in:', err);
            res.status(500).send('Error signing in');
        });
});

// Logout route
router.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).send('Error logging out');
        } else {
            res.redirect('/');
        }
    });
});

module.exports = router;
