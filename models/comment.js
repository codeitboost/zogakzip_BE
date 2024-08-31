const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    nickname: { type: String, required: true },
    content: { type: String, required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', commentSchema);
