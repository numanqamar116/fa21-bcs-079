const express = require('express');
const router = express.Router();
const Blog = require('../models/blog-model');

// Blog routes
router.get('/blogs', async (req, res) => {
    try {
        if (req.query.page && req.query.limit) {
            const page = parseInt(req.query.page);
            const limit = parseInt(req.query.limit);
            const skip = (page - 1) * limit;
            const blogs = await Blog.find({}).skip(skip).limit(limit);
            res.status(200).json(blogs);
        } else {
            const blogs = await Blog.find({});
            res.status(200).json(blogs);
        }
    } catch (err) {
        console.error('Error fetching blogs:', err);
        res.status(500).send({ message: err.message });
    }
});

router.post('/blogs', async (req, res) => {
    try {
        const blog = await Blog.create(req.body);
        res.status(200).json(blog);
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: err.message });
    }
});

router.get('/blogs/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        res.status(200).json(blog);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

router.put('/blogs/:id', async (req, res) => {
    try {
        const blog = await Blog.findByIdAndUpdate(req.params.id, req.body);
        if (!blog) {
            return res.status(404).send({ message: "Blog not found" });
        }
        res.status(200).json(blog);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

router.delete('/blogs/:id', async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (!blog) {
            return res.status(404).send({ message: "Blog not found" });
        }
        res.status(200).json(blog);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

router.get('/blog-page/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            res.status(404).send('Blog not found');
            return;
        }
        res.render('blog-page', { title: blog.title, blog, user: req.session.user });
    } catch (err) {
        console.error('Error fetching blog:', err);
        res.status(500).send('Error fetching blog');
    }
});

router.get('/authorsBlogs', async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (req.query.page && req.query.limit) {
            const page = parseInt(req.query.page);
            const limit = parseInt(req.query.limit);
            const skip = (page - 1) * limit;
            const blogs = await Blog.find({ 'author.name': req.session.user.name }).skip(skip).limit(limit);
            res.status(200).json(blogs);
        } else {
            const blogs = await Blog.find({ 'author.name': req.session.user.name });
            res.status(200).json(blogs);
        }
    } catch (err) {
        console.error('Error fetching blogs:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.get('/regularBlogs', async (req, res) => {
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 6;

    try {
        const blogs = await Blog.find({ type: 'regular' }).skip(skip).limit(limit).exec();
        const count = await Blog.countDocuments({ type: 'regular' }).exec();
        res.send({ posts: blogs, totalCount: count });
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;
