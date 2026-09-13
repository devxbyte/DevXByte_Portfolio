const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subtitle: { type: String, required: true },
  description: { type: String },
  typingTexts: [{ type: String }],
  resumeUrl: { type: String },
  image: { type: String },
  socialLinks: {
    github: { type: String },
    linkedin: { type: String },
    twitter: { type: String },
    instagram: { type: String }
  }
}, { timestamps: true });

module.exports = mongoose.model('Hero', heroSchema);
