var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
    title: String,
    description: String,
    createdBy: String,
    likes: { type: Number, default: 0 },
    likedBy: Array,
    dislikes:{ type: Number, default: 0 },
    dislikedBy: Array,
    comments: [{
        comment: String

    }]
});

module.exports = mongoose.model("postschema", postSchema);