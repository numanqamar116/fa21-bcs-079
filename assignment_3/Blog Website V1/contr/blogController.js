const Blog = require('./../models/blog-model');

// Create a new blog
exports.createBlog = async (req, res) => {
    try {
        const blog = await Blog.create(req.body);
        res.status(200).json(blog);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: err.message });
    }
};

// Get all blogs
exports.getBlogs = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const options = page && limit ? {
            skip: (parseInt(page) - 1) * parseInt(limit),
            limit: parseInt(limit)
        } : {};
        const blogs = await Blog.find({}, null, options);
        res.status(200).json(blogs);
    } catch (err) {
        console.error('Error fetching blogs:', err);
        res.status(500).send({ message: err.message });
    }
};

// Get a blog by ID
exports.getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        res.status(200).json(blog);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

// Update a blog
exports.updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!blog) {
            return res.status(404).send({ message: "Blog not found" });
        }
        res.status(200).json(blog);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

// Delete a blog
exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (!blog) {
            return res.status(404).send({ message: "Blog not found" });
        }
        res.status(200).json(blog);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};
