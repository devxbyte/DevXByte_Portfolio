const About = require('../models/About');

exports.getAbout = async (req, res) => {
  try {
    const about = await About.findOne();
    res.json(about || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAbout = async (req, res) => {
  try {
    let about = await About.findOne();
    if (about) {
      about = await About.findByIdAndUpdate(about._id, req.body, { new: true });
    } else {
      about = await About.create(req.body);
    }
    res.json(about);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
