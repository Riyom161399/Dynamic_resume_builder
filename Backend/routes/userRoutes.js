const router = require('express').Router();
const { getUser, updateUser } = require('../controllers/userController');

router.get('/:id', getUser);
router.put('/:id', updateUser);

module.exports = router;
// This code defines the user routes for getting and updating user information.