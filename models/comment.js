const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  nickname: { type: String, required: true },
  content: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true } // 게시물과 연결
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
