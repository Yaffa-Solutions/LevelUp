const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth.middleware');
const jobController = require('../controllers/jobController');

// talented person
router.get('/recommended',authenticate, jobController.getRecommendedJobs);
router.get('/available',authenticate, jobController.getAvailableJobs);
router.get('/saved',authenticate, jobController.getSavedJobs);
router.get('/:jobId/details', jobController.getJobDetails);
router.post('/apply/:jobId',authenticate, jobController.applyJob);
router.post('/save/:jobId',authenticate, jobController.saveJob);

// hunter
router.get('/my',authenticate, jobController.getHunterJobs);
router.post('/create',authenticate, jobController.createJob);
router.get('/:jobId/applicants', jobController.getApplicants);

module.exports = router;
