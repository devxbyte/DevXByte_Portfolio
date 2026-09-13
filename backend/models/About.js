const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  highlights: [{
    label: { type: String },
    value: { type: String }
  }]
}, { timestamps: true });

module.exports = mongoose.model('About', aboutSchema);
