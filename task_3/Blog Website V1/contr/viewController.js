const Blog = require('./../models/blog-model');

exports.renderHomePage = (req, res) => {
    res.render("main", { title: "Homepage", isAuthenticated: !!req.session.user, user: req.session.user });
};

exports.renderContactPage = (req, res) => {
    res.render("contact", { title: "Contact Us", isAuthenticated: !!req.session.user, user: req.session.user });
};

exports.renderBlogPage = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            res.status(404).send('Blog not found');
            return;
        }
        res.render('blog-page', { title: blog.title, isAuthenticated: !!req.session.user, blog, user: req.session.user });
    } catch (err) {
        console.error('Error fetching blog:', err);
        res.status(500).send('Error fetching blog');
    }
};

exports.renderEditBlogPage = (req, res) => {
    if (req.session.user) {
        res.render("EditBlog", { title: "Edit Blog", isAuthenticated: !!req.session.user, user: req.session.user });
    } else {
        res.redirect('/auth/signup');
    }
};
