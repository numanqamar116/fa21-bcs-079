const User = require('./../models/user-model');

// Handle user signup
exports.signup = (req, res) => {
    const { name, email, password } = req.body;
    User.findOne({ email })
        .then(existingUser => {
            if (existingUser) {
                res.render('signup', { errorMessage: 'Email already exists', layout: "authLayout" });
            } else {
                const newUser = new User({ name, email, password });
                newUser.save()
                    .then(() => res.redirect('/auth/signin'))
                    .catch(err => {
                        console.error('Error saving user:', err);
                        res.status(500).send('Error signing up user');
                    });
            }
        })
        .catch(err => {
            console.error('Error checking for existing user:', err);
            res.status(500).send('Error signing up user');
        });
};

// Handle user signin
exports.signin = (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email })
        .then(user => {
            if (user && user.password === password) {
                req.session.user = user;
                res.redirect('/home');
            } else {
                res.render('signin', { errorMessage: 'Email or password incorrect', layout: "authLayout" });
            }
        })
        .catch(err => {
            console.error('Error signing in:', err);
            res.status(500).send('Error signing in');
        });
};

// Handle user logout
exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).send('Error logging out');
        } else {
            res.redirect('/');
        }
    });
};
