const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  imageUrl: { type: String },
  isPublic: { type: Boolean, default: true },
  introduction: { type: String },
  likeCount: { type: Number, default: 0 } // 공감 수 필드 추가
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
