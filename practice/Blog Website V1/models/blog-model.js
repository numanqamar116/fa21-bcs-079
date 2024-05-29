const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        name: {
            type: String,
            required: true
        }
    },
    image: {
        type: String
    },
    textBody: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    category:{
        type: String,
        required:true
    },
    duration: {
        type: Number,
        required: true
    },
    author_intro:{
        type:String,
        required:true
    },
    isFeatured: {
        type: Boolean,
        default: false
        }

});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
