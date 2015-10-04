const router = require('express').Router();
const sessionsController = require('../controllers/sessionsController');
const sessionMiddleware = require('../middleware/sessionMiddleware');

router.post('/users/auth/', sessionsController.loginIn);
router.delete('/users/auth/', sessionMiddleware(), sessionsController.signOut);

module.exports = router;
