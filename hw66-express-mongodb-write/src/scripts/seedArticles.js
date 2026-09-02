require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Article = require('../models/Article');
const articles = require('../data/articles');

async function seed() {
  await connectDB();

  for (const article of articles) {
    await Article.findOneAndUpdate({ id: article.id }, article, { upsert: true, returnDocument: 'after' });
  }

  console.log(`Seeded ${articles.length} article(s) into the "articles" collection.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Failed to seed articles:', err);
  process.exit(1);
});
