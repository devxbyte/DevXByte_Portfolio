const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  siteTitle: { type: String, default: 'Devendra Saini | Portfolio' },
  metaDescription: { type: String, default: 'Full-Stack Developer Portfolio' },
  favicon: { type: String },
  analyticsId: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
