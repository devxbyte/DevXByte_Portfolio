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

  try {
    if (req.file.mimetype.startsWith('image/')) {
      // Upload images to Cloudinary
      const streamUpload = (req) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { 
              folder: 'portfolio', 
              transformation: [{ quality: 'auto', fetch_format: 'auto' }] 
            },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          Readable.from(req.file.buffer).pipe(stream);
        });
      };

      const result = await streamUpload(req);
      return res.json({ url: result.secure_url, filename: req.file.originalname });
    } else {
      // Save PDFs and other files to MongoDB
      const newFile = new File({
        filename: req.file.originalname,
        contentType: req.file.mimetype,
        data: req.file.buffer
      });
      const savedFile = await newFile.save();
      const protocol = req.get('host').includes('localhost') ? 'http' : 'https';
      const fileUrl = `${protocol}://${req.get('host')}/api/admin/file/${savedFile._id}`;
      return res.json({ url: fileUrl, filename: req.file.originalname });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error saving file', error: err.message });
  }
});

// Serve File from MongoDB
router.get('/file/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: 'File not found' });
    
    res.set('Content-Type', file.contentType);
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(file.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
