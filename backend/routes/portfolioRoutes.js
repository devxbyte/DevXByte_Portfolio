const express = require('express');
const router = express.Router();

const heroController = require('../controllers/heroController');
const aboutController = require('../controllers/aboutController');
const projectController = require('../controllers/projectController');
const skillController = require('../controllers/skillController');
const experienceController = require('../controllers/experienceController');
const educationController = require('../controllers/educationController');
const certificationController = require('../controllers/certificationController');
const contactController = require('../controllers/contactController');
const settingsController = require('../controllers/settingsController');

// Public GET routes
router.get('/hero', heroController.getHero);
router.get('/about', aboutController.getAbout);
router.get('/projects', projectController.getProjects);
router.get('/skills', skillController.getSkills);
router.get('/experience', experienceController.getExperiences);
router.get('/education', educationController.getEducation);
router.get('/certifications', certificationController.getCertifications);
router.get('/settings', settingsController.getSettings);

// Public POST (contact form)
router.post('/contact', contactController.submitContact);

module.exports = router;
