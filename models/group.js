const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  imageUrl: { type: String },
  isPublic: { type: Boolean, default: true },
  introduction: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Group', groupSchema);
