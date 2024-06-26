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

        req.session.visitedProducts = req.session.visitedProducts || [];
        req.session.visitedProducts.push(req.params.id);
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

router.get('/categories/:category?', async (req, res) => {
    

    const page = parseInt(req.query.page) || 1;
    const limit = 3;
    const searchQuery = req.query.search || '';
    const category = req.params.category || 'All';

    try {
        if (!req.session.searchHistory) {
            req.session.searchHistory = [];
        }

        if (searchQuery && req.session.user) {
            req.session.searchHistory.push(searchQuery);
            req.session.searchHistory = [...new Set(req.session.searchHistory)].slice(-5);
        }

        const query = {
            title: { $regex: searchQuery, $options: 'i' },
            category: category === 'All' ? { $regex: '' } : { $regex: category, $options: 'i' }
        };
        const count = await Blog.countDocuments(query);
        const totalPages = Math.ceil(count / limit);

        const blogs = await Blog.find(query)
            .skip((page - 1) * limit)
            .limit(limit);

        res.render('categories', {
            blogs: blogs,
            currentPage: page,
            totalPages: totalPages,
            category: category,
            searchQuery: searchQuery,
            searchHistory: req.session.searchHistory,
            title: "Edit Page",
            user: req.session.user // Pass user to the template
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }

});

router.get('/visited-blogs', async (req, res) => {
    try {
        if (!req.session.visitedProducts || req.session.visitedProducts.length === 0) {
            return res.status(404).send('No visited products found');
        }

        const visitedBlogs = await Blog.find({ _id: { $in: req.session.visitedProducts } });
        res.render('visited-blogs', { visitedBlogs,title: visitedBlogs.title, }); // Render the EJS file with the data
    } catch (err) {
        console.error('Error fetching visited blogs:', err);
        res.status(500).send({ message: err.message });
    }
});

module.exports = router;
