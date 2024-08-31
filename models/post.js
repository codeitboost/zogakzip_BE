const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  nickname: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  postPassword: { type: String, required: true },
  imageUrl: { type: String },
  tags: [String],
  location: { type: String },
  moment: { type: Date },
  isPublic: { type: Boolean, default: true },
  likeCount: { type: Number, default: 0 },
  commentCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);
