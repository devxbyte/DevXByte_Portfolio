const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const authController = require('../controllers/authController');
const heroController = require('../controllers/heroController');
const aboutController = require('../controllers/aboutController');
const projectController = require('../controllers/projectController');
const skillController = require('../controllers/skillController');
const experienceController = require('../controllers/experienceController');
const educationController = require('../controllers/educationController');
const certificationController = require('../controllers/certificationController');
const contactController = require('../controllers/contactController');
const settingsController = require('../controllers/settingsController');

// Auth
router.post('/login', authController.login);
router.get('/me', protect, authController.getMe);

// Hero
router.put('/hero', protect, heroController.updateHero);

// About
router.put('/about', protect, aboutController.updateAbout);

// Projects
router.post('/projects', protect, projectController.createProject);
router.put('/projects/:id', protect, projectController.updateProject);
router.delete('/projects/:id', protect, projectController.deleteProject);

// Skills
router.post('/skills', protect, skillController.createSkill);
router.put('/skills/:id', protect, skillController.updateSkill);
router.delete('/skills/:id', protect, skillController.deleteSkill);

// Experience
router.post('/experience', protect, experienceController.createExperience);
router.put('/experience/:id', protect, experienceController.updateExperience);
router.delete('/experience/:id', protect, experienceController.deleteExperience);

// Education
router.post('/education', protect, educationController.createEducation);
router.put('/education/:id', protect, educationController.updateEducation);
router.delete('/education/:id', protect, educationController.deleteEducation);

// Certifications
router.post('/certifications', protect, certificationController.createCertification);
router.put('/certifications/:id', protect, certificationController.updateCertification);
router.delete('/certifications/:id', protect, certificationController.deleteCertification);

// Messages
router.get('/messages', protect, contactController.getMessages);
router.get('/messages/unread', protect, contactController.getUnreadCount);
router.put('/messages/:id/read', protect, contactController.markAsRead);
router.delete('/messages/:id', protect, contactController.deleteMessage);

// Settings
router.put('/settings', protect, settingsController.updateSettings);

const cloudinary = require('cloudinary').v2;
const File = require('../models/File');
const { Readable } = require('stream');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// File Upload
router.post('/upload', protect, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  if (req.file.mimetype === 'application/pdf') {
    try {
      const newFile = new File({
        filename: req.file.originalname,
        contentType: req.file.mimetype,
        data: req.file.buffer
      });
      const savedFile = await newFile.save();
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const fileUrl = `${baseUrl}/api/admin/file/${savedFile._id}`;
      return res.json({ url: fileUrl, filename: req.file.originalname });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error saving PDF to database', error: err.message });
    }
  } else {
    try {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'portfolio', resource_type: 'auto' },
          (error, result) => {
            if (error) {
              console.error("Cloudinary Stream Error:", error);
              return reject(error);
            }
            resolve(result);
          }
        );
        Readable.from(req.file.buffer).pipe(stream);
      });
      return res.json({ url: result.secure_url, filename: req.file.originalname });
    } catch (err) {
      console.error("Cloudinary Catch Error:", err);
      // Sometimes Cloudinary returns an object with {message, http_code} instead of a standard Error
      const errMsg = err.message || (typeof err === 'object' ? JSON.stringify(err) : String(err));
      return res.status(500).json({ message: 'Error uploading to Cloudinary', error: errMsg });
    }
  }
});

// Serve File from MongoDB
router.get('/file/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: 'File not found' });
    
    res.set('Content-Type', file.contentType);
    res.send(file.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
