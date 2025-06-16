const router = require('express').Router();
const { signup, login, logout } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);

module.exports = router;
// This code defines the authentication routes for user signup, login, and logout.