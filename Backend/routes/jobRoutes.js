const router = require('express').Router();
const { getJobs, postJob, applyToJob } = require('../controllers/jobController');

router.get('/', getJobs);
router.post('/', postJob);
router.post('/:id/apply', applyToJob);

module.exports = router;

