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

// File Upload
router.post('/upload', protect, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const fileUrl = req.file.path; // Cloudinary secure URL
  res.json({ url: fileUrl, filename: req.file.filename || req.file.path });
});

module.exports = router;
