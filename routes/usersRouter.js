const router = require('express').Router();
const usersController = require('../controllers/usersController');
const sessionMiddleware = require('../middleware/sessionMiddleware');

router.post('/users/', usersController.createUser);
router.put('/user/', sessionMiddleware(), usersController.updateUser);
router.delete('/user/', sessionMiddleware(), usersController.deleteUser);
router.get('/user/', sessionMiddleware(), usersController.getUserInfo);

module.exports = router;
