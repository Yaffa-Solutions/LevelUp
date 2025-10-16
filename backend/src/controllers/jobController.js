const jobService = require('../services/jobService');

// const getRecommendedJobs = async (req, res) => {
//   try {
//     if (!req.user?.id) return res.status(401).json({ message: 'User ID missing' });
    
//     const data = await jobService.getRecommendedJobs(req.user.id);
//     res.json(data);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
const getRecommendedJobs = (req, res) => {
  if (!req.user?.id) return res.status(400).json({ message: 'User ID missing' });

  const recommended = jobService.getRecommendedJobs(req.user);
  res.json(recommended);
};

const getAvailableJobs = async (req, res) => {
  try {
    const data = await jobService.getAvailableJobs();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getJobDetails = async (req, res) => {
  try {
    const data = await jobService.getJobDetails(req.params.jobId);
    if (!data) return res.status(404).json({ message: 'Job not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const applyJob = async (req, res) => {
   const { jobId } = req.params;
  const userId = req.user?.userId;

  if (!jobId) return res.status(400).json({ message: "Job ID missing" });
  if (!userId) return res.status(400).json({ message: "User ID missing" });

  try {
    const data = await jobService.applyJob(jobId, userId);
    res.json({ message: "Applied successfully", data});
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const saveJob = async (req, res) => {
  try {
    const data = await jobService.saveJob(req.user.id, req.params.jobId);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getSavedJobs = async (req, res) => {
  try {
    const data = await jobService.getSavedJobs(req.user.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// hunter
const getHunterJobs = async (req, res) => {
  try {
    const data = await jobService.getHunterJobs(req.user.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// const createJob = async (req, res) => {
//   try {
//     const data = await jobService.createJob(req.user.id, req.body);
//     res.json(data);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };


const createJob = async (req, res) => {
  try {
    const hunterId = req.user.userId; 
    if (!hunterId) return res.status(401).json({ message: 'Unauthorized' });

    const { meta_data } = req.body;
    const job = await jobService.createJob(hunterId, meta_data);

    res.status(201).json(job);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

const getApplicants = async (req, res) => {
  try {
    const data = await jobService.getApplicants(req.params.jobId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
    getRecommendedJobs,
    getAvailableJobs,
    getJobDetails,
    applyJob,
    saveJob,
    getSavedJobs,
    getHunterJobs,
    createJob,
    getApplicants
}