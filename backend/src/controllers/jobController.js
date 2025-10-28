const jobService = require('../services/jobService');

const getRecommendedJobs = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(400).json({ message: 'User ID missing' });

    const recommended = await jobService.getRecommendedJobs(userId);
    res.json(recommended);
  } catch (err) {
    res.status(500).json(err.message );
  }
};

const getAvailableJobs = async (req, res) => {
  try {
    const data = await jobService.getAvailableJobs();
    res.json(data);
  } catch (err) {
    res.status(500).json( err.message );
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
    res.status(400).json( err.message );
  }
};

const saveJob = async (req, res) => {
  try {
    const data = await jobService.saveJob(req.user.userId, req.params.jobId);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const unsaveJob = async (req, res) => {
  try {
    const userId = req.user.userId;
    const jobId = req.params.jobId;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    if (!jobId) return res.status(400).json({ message: 'Job ID missing' });

    const result = await jobService.unsaveJob(userId, jobId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
const toggleSaveJob = async (req, res) => {
  try {
    const userId = req.user.userId;
    const jobId = req.params.jobId;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    if (!jobId) return res.status(400).json({ message: 'Job ID missing' });

    // تحقق إذا الوظيفة محفوظة بالفعل
    const saved = await jobService.getJobSave(userId, jobId);

    if (saved) {
      // لو محفوظة، نحذفها
      await jobService.unsaveJob(userId, jobId);
      return res.json({ action: 'unsaved', message: 'Job removed from saved list.' });
    } else {
   
      await jobService.saveJob(userId, jobId);
      return res.json({ action: 'saved', message: 'Job saved successfully!' });
    }

  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

const getSavedJobs = async (req, res) => {
  try {
    const data = await jobService.getSavedJobs(req.user.userId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// hunter
const getHunterJobs = async (req, res) => {
  try {
    const data = await jobService.getHunterJobs(req.user.userId);
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

const updateJob = async (req, res) => {
  try {
    const hunterId = req.user.userId
    const jobId = req.params.jobId
    const data = req.body

    if (!hunterId) return res.status(401).json({ message: 'Unauthorized' })
    if (!jobId) return res.status(400).json({ message: 'Job ID required' })

    const updated = await jobService.updateJob(jobId, hunterId, data)
    res.json(updated)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

const deleteJob = async (req, res) => {
  try {
    const hunterId = req.user.userId;
    const jobId = req.params.jobId;

    if (!hunterId) return res.status(401).json({ message: 'Unauthorized' });
    if (!jobId) return res.status(400).json({ message: 'Job ID required' });

    const result = await jobService.deleteJob(jobId, hunterId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const appliedJobs = await jobService.getAppliedJobs(userId);
    res.json(appliedJobs);
  } catch (err) {
    res.status(500).json( err.message );
  }
};

const unapplyJob = async (req, res) => {
  try {
    const userId = req.user.userId;
    const jobId = req.params.jobId;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    if (!jobId) return res.status(400).json({ message: 'Job ID missing' });

    const result = await jobService.unapplyJob(jobId, userId);
    res.json({ message: 'Unapplied successfully', result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


module.exports = {
    getRecommendedJobs,
    getAvailableJobs,
    getJobDetails,
    applyJob,
    saveJob,
    unsaveJob,
    toggleSaveJob,
    getSavedJobs,
    getHunterJobs,
    createJob,
    getApplicants,
    updateJob, 
    deleteJob,
    getAppliedJobs,
    unapplyJob,

}