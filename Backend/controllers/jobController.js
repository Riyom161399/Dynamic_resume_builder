const Job = require('../models/Job');
const User = require('../models/User');

exports.getJobs = async (req, res) => {
  const jobs = await Job.find().sort({ postedAt: -1 });
  res.json(jobs);
};

exports.postJob = async (req, res) => {
  const job = await Job.create(req.body);
  res.status(201).json(job);
};

exports.applyToJob = async (req, res) => {
  const job = await Job.findById(req.params.id);
  const user = await User.findById(req.session.userId);

  if (!job || !user) return res.status(404).json({ error: "Job or user not found" });

  job.applicants.push(user._id);
  user.appliedJobs.push(job._id);
  await job.save();
  await user.save();

  res.json({ message: 'Application submitted' });
};
exports.getJobApplicants = async (req, res) => {
  const job = await Job.findById(req.params.id).populate('applicants', '-password');
  if (!job) return res.status(404).json({ error: "Job not found" });
  res.json(job.applicants);
};