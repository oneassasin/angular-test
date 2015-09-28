const router = require('express').Router();
const usersController = require('../controllers/usersController');

router.post('/users/', usersController.createUser);
router.put('/users/', usersController.updateUser);
router.delete('/users/:id[0-9]+/', usersController.deleteUser);
router.get('/users/:id[0-9]+/', usersController.getUserInfo);

module.exports = router;
