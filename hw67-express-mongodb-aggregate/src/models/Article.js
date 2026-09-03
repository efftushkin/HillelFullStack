const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    publishedAt: { type: String, required: true },
    content: { type: String, required: true },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Article', articleSchema);
